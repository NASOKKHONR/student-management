import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { Student } from '../models/student';
import { StudentService } from '../services/student';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css']
})
export class HomePageComponent implements OnInit {
  filteredStudents: Student[] = [];
  searchText = '';
  selectedGender = 'All';
  darkMode = true;
  showDropdown = false;
  
  student: Student = { id: 0, name: '', gender: '', address: '', image: '' };

  provinces: string[] = [
    'Banteay Meanchey', 'Battambang', 'Kampong Cham', 'Kampong Chhnang', 
    'Kampong Speu', 'Kampong Thom', 'Kampot', 'Kandal', 'Kep', 
    'Koh Kong', 'Kratie', 'Mondulkiri', 'Phnom Penh', 'Preah Vihear', 
    'Preah Sihanouk', 'Prey Veng', 'Pursat', 'Ratanakiri', 'Siem Reap', 
    'Stung Treng', 'Svay Rieng', 'Takeo', 'Tbong Khmum', 'Pailin', 'Oddar Meanchey'
  ];

  constructor(private studentService: StudentService) {}

  get students(): Student[] {
    return this.studentService.getStudents();
  }

  ngOnInit(): void {
    this.refreshList();
  }

  getGenderCount(gender: string): number {
    return this.students.filter(s => s.gender === gender).length;
  }

  refreshList() {
    const allStudents = this.studentService.getStudents();
    this.filteredStudents = allStudents.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(this.searchText.toLowerCase());
      const matchGender = this.selectedGender === 'All' || s.gender === this.selectedGender;
      return matchSearch && matchGender;
    });
  }

  getFilteredProvinces(): string[] {
    if (!this.student.address) return this.provinces;
    return this.provinces.filter(p => p.toLowerCase().includes(this.student.address.toLowerCase()));
  }

  selectProvince(province: string) {
    this.student.address = province;
    this.showDropdown = false;
  }

  hideDropdownWithDelay() {
    setTimeout(() => { this.showDropdown = false; }, 200);
  }

  addStudent() {
    if (!this.student.id || !this.student.name.trim() || !this.student.gender || !this.student.address.trim() || !this.student.image) {
      Swal.fire({ icon: 'error', title: 'Validation Error', text: 'Please fill all fields!' });
      return;
    }
    
    // បញ្ចៀសការស្ទួន ID
    const exists = this.students.some(s => s.id === this.student.id);
    if (exists) {
      Swal.fire({ icon: 'error', title: 'Duplicate ID', text: 'This Student ID already exists!' });
      return;
    }

    this.studentService.addStudent(this.student);
    Swal.fire({ icon: 'success', title: 'Insert Completed', timer: 1500, showConfirmButton: false });
    this.refreshList();
    this.clearForm();
  }

  filterStudents() { this.refreshList(); }
  sortStudents() { this.studentService.sortStudents(); this.refreshList(); }
  clearForm() { this.student = { id: 0, name: '', gender: '', address: '', image: '' }; }
  toggleTheme() { this.darkMode = !this.darkMode; }

  clearAll() {
    this.studentService.clearAllStudents();
    this.refreshList();
    Swal.fire({ icon: 'success', title: 'All Data Cleared', timer: 1000, showConfirmButton: false });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { this.student.image = reader.result as string; };
    reader.readAsDataURL(file);
  }

  trackByStudent(index: number, student: Student) { return student.id; }
}