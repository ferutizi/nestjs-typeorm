import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './profile.entity';

export class UsersService {
  constructor(
    // eslint-disable-next-line prettier/prettier
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) { }

  async createUser(user: CreateUserDto) {
    const userFound = await this.userRepository.findOne({
      where: {
        username: user.username
      }
    })
    
    if(userFound) {
      return new HttpException('El usuario ya existe', HttpStatus.CONFLICT)
    }

    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  getUsers() {
    return this.userRepository.find()
  }

  async getUser(id: number) {
    const userFound = await this.userRepository.findOne({
      where: {
        id: id
      }
    })

    if(!userFound) {
      return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
    }

    return userFound;
  }

  async deleteUser(id: number) {
    const result = await this.userRepository.delete({ id })

    if(result.affected === 0) {
      return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
    }

    return result;
  }

  async updateUser(id: number, user: UpdateUserDto) {
    const userFound = await this.userRepository.findOne({
      where: {
        id
      }
    })

    if(!userFound) {
      return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
    }

    const updateUser = Object.assign(userFound, user)
    return this.userRepository.save(updateUser)
  }

  async createProfile(id: number, profile: CreateProfileDto) {
    const userFound = await this.userRepository.findOne({
      where: { id },
      relations: ["profile"]
    });

    if (!userFound) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    if (userFound.profile) {
      throw new HttpException('El usuario ya tiene un perfil', HttpStatus.CONFLICT);
    }

    const newProfile = this.profileRepository.create(profile)
    const savedProfile = await this.profileRepository.save(newProfile)
    userFound.profile = savedProfile

    return this.userRepository.save(userFound)
  }
}
