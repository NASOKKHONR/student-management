import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Student } from '../models/student';
import { StudentService } from '../services/student';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit.html',
  styleUrls: ['./edit.css']
})
export class EditComponent implements OnInit {
  student!: Student;
  studentIndex!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    // ចាប់យក ID ពី URL Route Path
    const studentId = Number(this.route.snapshot.paramMap.get('id'));
    const allStudents = this.studentService.getStudents();
    
    this.studentIndex = allStudents.findIndex(s => s.id === studentId);

    if (this.studentIndex !== -1) {
      // បង្កើត Object ថ្មីមួយដើម្បីកុំឱ្យវាប៉ះពាល់ទិន្នន័យដើមភ្លាមៗទាល់តែចុច Update
      this.student = { ...allStudents[this.studentIndex] };
    } else {
      Swal.fire('Error', 'Student not found!', 'error');
      this.router.navigate(['/']);
    }
  }

  updateStudent() {
    if (!this.student.name.trim() || !this.student.address.trim()) {
      Swal.fire('Warning', 'Please fill all fields!', 'warning');
      return;
    }
    
    this.studentService.updateStudent(this.studentIndex, this.student);
    Swal.fire({ icon: 'success', title: 'Updated Successfully', timer: 1500, showConfirmButton: false });
    this.router.navigate(['/']); // ត្រឡប់ទៅកាន់ទំព័រដើមវិញ
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { this.student.image = reader.result as string; };
    reader.readAsDataURL(file);
  }
}