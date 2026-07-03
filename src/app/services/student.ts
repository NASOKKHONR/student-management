import { Injectable } from '@angular/core';
import { Student } from '../models/student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private STORAGE_KEY = 'students';
  private students: Student[] = [];

  constructor() {
    
    this.students = this.loadFromStorage();
  }

  
  private loadFromStorage(): Student[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

 
  getStudents(): Student[] {
    return this.students;
  }


  addStudent(newStudent: Student): void {
    this.students.push({ ...newStudent });
    this.saveToStorage();
  }

 
  updateStudent(index: number, updatedStudent: Student): void {
    if (index >= 0 && index < this.students.length) {
      this.students[index] = { ...updatedStudent };
      this.saveToStorage();
    }
  }

  
  deleteStudent(id: number): void {
    this.students = this.students.filter(s => s.id !== id);
    this.saveToStorage();
  }


  clearAllStudents(): void {
    this.students = [];
    localStorage.removeItem(this.STORAGE_KEY);
  }


  sortStudents(): void {
    this.students.sort((a, b) => a.name.localeCompare(b.name));
    this.saveToStorage();
  }

  
  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.students));
  }
}
