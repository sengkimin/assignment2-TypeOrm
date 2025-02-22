import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Teacher } from "./Teacher";

@Entity({ name: "Class" })
export class Class {
  @PrimaryGeneratedColumn({ name: "class_id" })
  id!: number;

  @Column({ name: "class_name", type: "varchar", length: 100 })
  className!: string;

  @Column({ name: "subject", type: "varchar", length: 100 })
  subject!: string;

  @ManyToOne(() => Teacher, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "teacher_id" })
  teacher?: Teacher;
}
