import fs from 'fs';
import path from 'path';

export interface Document {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export class Collection<T extends Document> {
  private filePath: string;
  private items: T[] = [];

  constructor(private name: string, baseDir: string, defaultData: T[] = []) {
    this.filePath = path.join(baseDir, `${name}.json`);
    this.init(defaultData);
  }

  private init(defaultData: T[]) {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        this.items = JSON.parse(raw);
      } else {
        this.items = defaultData;
        this.save();
      }
    } catch (err) {
      console.error(`[NoSQL] Error initializing collection ${this.name}:`, err);
      this.items = defaultData;
    }
  }

  private save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.items, null, 2), 'utf-8');
    } catch (err) {
      console.error(`[NoSQL] Error saving collection ${this.name}:`, err);
    }
  }

  public find(query?: Partial<T>): T[] {
    if (!query || Object.keys(query).length === 0) {
      return [...this.items];
    }
    return this.items.filter(item => {
      return Object.entries(query).every(([k, v]) => (item as any)[k] === v);
    });
  }

  public findOne(query: Partial<T>): T | null {
    const found = this.items.find(item => {
      return Object.entries(query).every(([k, v]) => (item as any)[k] === v);
    });
    return found ? { ...found } : null;
  }

  public findById(id: string): T | null {
    return this.findOne({ _id: id } as any);
  }

  public insertOne(doc: Omit<T, '_id' | 'createdAt' | 'updatedAt'> & { _id?: string }): T {
    const now = new Date().toISOString();
    const newDoc: T = {
      ...doc,
      _id: doc._id || 'doc_' + Math.random().toString(36).substring(2, 11),
      createdAt: now,
      updatedAt: now,
    } as T;

    this.items.push(newDoc);
    this.save();
    return newDoc;
  }

  public updateOne(query: Partial<T>, updates: Partial<T>): T | null {
    const index = this.items.findIndex(item => {
      return Object.entries(query).every(([k, v]) => (item as any)[k] === v);
    });

    if (index === -1) return null;

    const updatedItem = {
      ...this.items[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.items[index] = updatedItem;
    this.save();
    return updatedItem;
  }

  public deleteOne(query: Partial<T>): boolean {
    const index = this.items.findIndex(item => {
      return Object.entries(query).every(([k, v]) => (item as any)[k] === v);
    });

    if (index === -1) return false;

    this.items.splice(index, 1);
    this.save();
    return true;
  }

  public countDocuments(query?: Partial<T>): number {
    return this.find(query).length;
  }
}

export class NoSqlDatabase {
  private baseDir: string;
  private collections: Map<string, Collection<any>> = new Map();

  constructor(dataDirectory: string) {
    this.baseDir = dataDirectory;
  }

  public collection<T extends Document>(name: string, defaultData: T[] = []): Collection<T> {
    if (!this.collections.has(name)) {
      this.collections.set(name, new Collection<T>(name, this.baseDir, defaultData));
    }
    return this.collections.get(name)! as Collection<T>;
  }
}
