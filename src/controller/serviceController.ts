import { Request, Response } from 'express';
import * as serviceService from '../service/serviceService';
import errorHandler from '../middlewares/errorHandler';
import Service from '../database/models/serviceEntity';
import dbConnection from '../database';

const serviceRepo = dbConnection.getRepository(Service);
export const createService = errorHandler(
  async (
    req: Request,
    res: Response
  ): Promise<Response<Record<string, unknown>> | undefined> => {
    const { name, description } = req.body;

    const existingService = await serviceRepo.findOne({ where: { name } });
    if (existingService) {
      return res
        .status(409)
        .json({ message: 'Service with this name already exists' });
    }

    const newService = await serviceService.createService({
      name,
      description,
    });
    return res
      .status(201)
      .json({ message: 'Service created successfully', service: newService });
  }
);

export const getAllServices = errorHandler(
  async (
    _req: Request,
    res: Response
  ): Promise<Response<Record<string, unknown>> | undefined> => {
    const services = await serviceService.getAllServices();
    return res.status(200).json({ services });
  }
);
