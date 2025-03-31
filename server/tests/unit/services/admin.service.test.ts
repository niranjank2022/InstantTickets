import { AdminService } from './../../../src/services/admin.service';
import { AdminRepository } from './../../../src/repositories/admin.repository';
import { messages } from './../../../src/config/logger';

// Mock the AdminRepository methods
jest.mock('./../../../src/repositories/admin.repository', () => ({
  AdminRepository: {
    create: jest.fn(),
    findOne: jest.fn(),
    exists: jest.fn(),
  },
}));

describe('AdminService', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('createAdmin', () => {
    it('should successfully create an admin', async () => {
      const adminData = { email: 'admin@example.com', password: 'password123' };
      const mockedAdmin = { ...adminData, _id: 'admin123' };

      // Mock the create function to return the mocked admin
      (AdminRepository.create as jest.Mock).mockResolvedValue(mockedAdmin);

      const result = await AdminService.createAdmin(adminData);

      expect(AdminRepository.create).toHaveBeenCalledWith(adminData);
      expect(result).toEqual(mockedAdmin);
    });

    it('should throw an error if create fails', async () => {
      const adminData = { email: 'admin@example.com', password: 'password123' };

      // Mock the create function to throw an error
      (AdminRepository.create as jest.Mock).mockRejectedValue(new Error('DB error'));

      await expect(AdminService.createAdmin(adminData)).rejects.toThrowError(
        `${messages.booking.CREATE_ERROR}DB error`
      );
    });
  });

  describe('getAdminByEmail', () => {
    it('should return an admin by email', async () => {
      const email = 'admin@example.com';
      const mockedAdmin = { email: 'admin@example.com', password: 'password123' };

      // Mock the findOne function to return the mocked admin
      (AdminRepository.findOne as jest.Mock).mockResolvedValue(mockedAdmin);

      const result = await AdminService.getAdminByEmail(email);

      expect(AdminRepository.findOne).toHaveBeenCalledWith({ email });
      expect(result).toEqual(mockedAdmin);
    });

    it('should throw an error if getAdminByEmail fails', async () => {
      const email = 'admin@example.com';

      // Mock the findOne function to throw an error
      (AdminRepository.findOne as jest.Mock).mockRejectedValue(new Error('DB error'));

      await expect(AdminService.getAdminByEmail(email)).rejects.toThrowError(
        `${messages.booking.CREATE_ERROR}DB error`
      );
    });
  });

  describe('doesAdminExists', () => {
    it('should return true if the admin exists', async () => {
      const email = 'admin@example.com';

      // Mock the exists function to return true
      (AdminRepository.exists as jest.Mock).mockResolvedValue(true);

      const result = await AdminService.doesAdminExists(email);

      expect(AdminRepository.exists).toHaveBeenCalledWith({ email });
      expect(result).toBe(true);
    });

    it('should return false if the admin does not exist', async () => {
      const email = 'admin@example.com';

      // Mock the exists function to return false
      (AdminRepository.exists as jest.Mock).mockResolvedValue(false);

      const result = await AdminService.doesAdminExists(email);

      expect(AdminRepository.exists).toHaveBeenCalledWith({ email });
      expect(result).toBe(false);
    });

    it('should throw an error if doesAdminExists fails', async () => {
      const email = 'admin@example.com';

      // Mock the exists function to throw an error
      (AdminRepository.exists as jest.Mock).mockRejectedValue(new Error('DB error'));

      await expect(AdminService.doesAdminExists(email)).rejects.toThrowError(
        `${messages.booking.CREATE_ERROR}DB error`
      );
    });
  });
});
