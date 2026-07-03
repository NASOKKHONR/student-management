import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Student } from '../models/student';
import { StudentService } from '../services/student';

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './delete.html',
  styleUrls: ['./delete.css']
})
export class DeleteComponent implements OnInit {
  student!: Student | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    const studentId = Number(this.route.snapshot.paramMap.get('id'));
    this.student = this.studentService.getStudents().find(s => s.id === studentId);

    if (!this.student) {
      Swal.fire('Error', 'Student not found!', 'error');
      this.router.navigate(['/']);
    }
  }

  confirmDelete() {
    if (this.student) {
      this.studentService.deleteStudent(this.student.id);
      Swal.fire({ icon: 'success', title: 'Deleted Successfully', timer: 1500, showConfirmButton: false });
    }
    this.router.navigate(['/']);
  }
}