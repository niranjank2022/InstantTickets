import { AdminRepository } from './../../../src/repositories/admin.repository';
import { Admin } from './../../../src/models/admin.model';
import { messages } from './../../../src/config/logger';

// Mock Mongoose Methods
jest.mock('./../../../src/models/admin.model', () => ({
  Admin: {
    create: jest.fn(),
    findOne: jest.fn(),
    exists: jest.fn(),
  },
}));

describe('AdminRepository', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test to ensure independence
  });

  describe('create', () => {
    it('should successfully create an admin', async () => {
      const adminData = { email: 'admin@example.com', password: 'password123' };
      const mockedAdmin = { ...adminData, _id: 'admin123' };

      // Mock the create function to return mocked data
      (Admin.create as jest.Mock).mockResolvedValue(mockedAdmin);

      const result = await AdminRepository.create(adminData);

      expect(Admin.create).toHaveBeenCalledWith(adminData);
      expect(result).toEqual(mockedAdmin);
    });

    it('should throw an error if create fails', async () => {
      const adminData = { email: 'admin@example.com', password: 'password123' };

      // Mock the create function to throw an error
      (Admin.create as jest.Mock).mockRejectedValue(new Error('DB error'));

      await expect(AdminRepository.create(adminData)).rejects.toThrowError(`${messages.booking.CREATE_ERROR}DB error`);
    });
  });

  describe('findOne', () => {
    it('should find an admin by filter', async () => {
      const filter = { email: 'admin@example.com' };
      const mockedAdmin = { email: 'admin@example.com', password: 'password123' };

      // Mock the findOne function to return a mocked admin
      (Admin.findOne as jest.Mock).mockResolvedValue(mockedAdmin);

      const result = await AdminRepository.findOne(filter);

      expect(Admin.findOne).toHaveBeenCalledWith(filter);
      expect(result).toEqual(mockedAdmin);
    });

    it('should throw an error if findOne fails', async () => {
      const filter = { email: 'admin@example.com' };

      // Mock the findOne function to throw an error
      (Admin.findOne as jest.Mock).mockRejectedValue(new Error('DB error'));

      await expect(AdminRepository.findOne(filter)).rejects.toThrowError(`${messages.booking.DELETE_ERROR}DB error`);
    });
  });

  describe('exists', () => {
    it('should return true if admin exists', async () => {
      const filter = { email: 'admin@example.com' };

      // Mock the exists function to return true
      (Admin.exists as jest.Mock).mockResolvedValue(true);

      const result = await AdminRepository.exists(filter);

      expect(Admin.exists).toHaveBeenCalledWith(filter);
      expect(result).toBe(true);
    });

    it('should return false if admin does not exist', async () => {
      const filter = { email: 'admin@example.com' };

      // Mock the exists function to return false
      (Admin.exists as jest.Mock).mockResolvedValue(false);

      const result = await AdminRepository.exists(filter);

      expect(Admin.exists).toHaveBeenCalledWith(filter);
      expect(result).toBe(false);
    });

    it('should throw an error if exists fails', async () => {
      const filter = { email: 'admin@example.com' };

      // Mock the exists function to throw an error
      (Admin.exists as jest.Mock).mockRejectedValue(new Error('DB error'));

      await expect(AdminRepository.exists(filter)).rejects.toThrowError(`${messages.booking.DELETE_ERROR}DB error`);
    });
  });
});
