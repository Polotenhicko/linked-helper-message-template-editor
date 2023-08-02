class LocalStorage {
  public getItem(key: string) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.error('LocalStorageService error:', e);
      return null;
    }
  }

  public setItem(key: string, value: any) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('LocalStorageService error:', e);
      return false;
    }
  }
}

export default new LocalStorage();
