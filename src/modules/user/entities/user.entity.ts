import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OTPEntity } from "./otp.entity";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({nullable: true})
    first_name: string;

    @Column({nullable: true})
    last_name: string;

    @Column({ type: 'varchar' }) 
    mobile: string;

    @Column({ default: false })
    mobile_verfy: boolean;

    @Column({nullable: true})
    OTPId: number

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToOne(() => OTPEntity, (otp) => otp.user)
    @JoinColumn({name: 'OTPId'})
    otp: OTPEntity
}
