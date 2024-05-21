import { Request, Response } from 'express';
import dbConnection from '../database';
import { Role } from '../database/models/roleEntity';
import {
  createRoleSchema,
  updateRoleSchema,
  changeRoleSchema,
} from '../middlewares/roleSchema';
import UserModel from '../database/models/userModel';

const roleRepository = dbConnection.getRepository(Role);
const userRepository = dbConnection.getRepository(UserModel);

class roleController {
  static async createRole(req: Request, res: Response) {
    const formData = req.body;

    const validationResult = createRoleSchema.validate(formData);
    if (validationResult.error) {
      return res
        .status(400)
        .json({ msg: validationResult.error.details[0].message });
    }

    try {
      const existingRole = await roleRepository.findOneBy({
        name: formData.name,
      });

      if (existingRole) {
        return res.status(409).json({ msg: 'Role already exists' });
      }

      const role = new Role();
      role.name = formData.name;
      role.permissions = formData.permissions;

      const savedRole = await roleRepository.save(role);
      return res
        .status(201)
        .json({ msg: 'Role created successfully', role: savedRole });
    } catch (err) {
      res.status(500).json({ msg: 'Internal Server Error' });
    }
  }

  static async getRoles(req: Request, res: Response) {
    try {
      const roles = await roleRepository.find();
      if (roles) {
        return res.status(200).json({ roles });
      } else {
        return res.status(404).json({ msg: 'Roles not found' });
      }
    } catch (err) {
      res.status(500).json({ msg: 'Internal Server Error' });
    }
  }

  static async updateRole(req: Request, res: Response) {
    const formData = req.body;

    const validationResult = updateRoleSchema.validate(formData);
    if (validationResult.error) {
      return res
        .status(400)
        .json({ msg: validationResult.error.details[0].message });
    }

    try {
      const roleToUpdate = await roleRepository.findOneBy({
        id: parseInt(formData.id),
      });

      if (roleToUpdate) {
        roleToUpdate.name = formData.name;
        roleToUpdate.permissions = formData.permissions;

        await roleRepository.save(roleToUpdate);
        return res.status(200).json({ msg: 'Role successfully updated' });
      } else {
        return res.status(404).json({ msg: 'Role not found' });
      }
    } catch (err) {
      res.status(500).json({ msg: 'Internal Server Error' });
    }
  }

  static async deleteRole(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);
    try {
      const roleToDelete = await roleRepository.findOneBy({
        id: id,
      });

      if (roleToDelete) {
        await roleRepository.remove(roleToDelete);
        return res.status(204).json({});
      } else {
        return res.status(404).json({ msg: 'Role not found' });
      }
    } catch (err) {
      res.status(500).json({ msg: 'Internal Server Error' });
    }
  }

  static async changeRole(req: Request, res: Response) {
    const formData = req.body;
    const validationResult = changeRoleSchema.validate(formData);
    if (validationResult.error) {
      return res
        .status(400)
        .json({ msg: validationResult.error.details[0].message });
    }

    try {
      const user = await userRepository.findOneBy({
        id: formData.userId,
      });

      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      const role = await roleRepository.findOneBy({
        id: formData.newRoleId,
      });

      if (!role) {
        return res.status(404).json({ msg: 'Role not found' });
      }

      user.userType = role;
      await userRepository.save(user);
      return res.status(200).json({ msg: 'User role successfully updated' });
    } catch (err) {
      res.status(500).json({ msg: 'Internal Server Error' });
    }
  }
}

export default roleController;
