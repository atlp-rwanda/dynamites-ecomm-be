import Service from '../database/models/serviceEntity';
import dbConnection from '../database';
interface ServiceData {
  name: string;
  description: string;
}
export const createService = async (serviceData: ServiceData) => {
  const serviceRepo = dbConnection.getRepository(Service);
  const service = new Service(serviceData);
  return serviceRepo.save(service);
};

export const getAllServices = async () => {
  const serviceRepo = dbConnection.getRepository(Service);
  return serviceRepo.find();
};
