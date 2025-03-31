import request from 'supertest';
import app from './../../../src/app'; // Assuming you export your express app from 'app.ts'
import { AdminService } from './../../../src/services/admin.service';
import jwt from 'jsonwebtoken';

jest.mock('./../../../src/services/admin.service');
jest.mock('jsonwebtoken');

describe('AuthController', () => {
  describe('POST apis/auth/signin', () => {
    it('should successfully sign in the admin', async () => {
      const mockAdmin = {
        _id: 'admin123',
        email: 'admin@example.com',
        password: 'hashedPassword',
        isValidPassword: jest.fn().mockResolvedValue(true),
      };
      (AdminService.getAdminByEmail as jest.Mock).mockResolvedValue(mockAdmin);
      (jwt.sign as jest.Mock).mockReturnValue('mockToken');

      const response = await request(app)
        .post('/apis/auth/signin')
        .send({ email: 'admin@example.com', password: 'password123' });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('sign in successful');
      expect(response.body.token).toBe('mockToken');
      expect(AdminService.getAdminByEmail).toHaveBeenCalledWith('admin@example.com');
      expect(mockAdmin.isValidPassword).toHaveBeenCalledWith('password123');
    });

    it('should return 404 if admin not found', async () => {
      (AdminService.getAdminByEmail as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/apis/auth/signin')
        .send({ email: 'admin@example.com', password: 'password123' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('should return 400 if password is incorrect', async () => {
      const mockAdmin = {
        _id: 'admin123',
        email: 'admin@example.com',
        password: 'hashedPassword',
        isValidPassword: jest.fn().mockResolvedValue(false),
      };
      (AdminService.getAdminByEmail as jest.Mock).mockResolvedValue(mockAdmin);

      const response = await request(app)
        .post('/apis/auth/signin')
        .send({ email: 'admin@example.com', password: 'wrongPassword' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('email or password incorrect');
    });

    it('should return 500 if error occurs', async () => {
      (AdminService.getAdminByEmail as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

      const response = await request(app)
        .post('/apis/auth/signin')
        .send({ email: 'admin@example.com', password: 'password123' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('error occurred');
    });
  });

  describe('POST apis/auth/signup', () => {
    it('should successfully sign up an admin', async () => {
      const mockAdmin = { _id: 'admin123', email: 'admin@example.com', password: 'hashedPassword' };
      (AdminService.doesAdminExists as jest.Mock).mockResolvedValue(false);
      (AdminService.createAdmin as jest.Mock).mockResolvedValue(mockAdmin);
      (jwt.sign as jest.Mock).mockReturnValue('mockToken');

      const response = await request(app)
        .post('/apis/auth/signup')
        .send({ email: 'admin@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('sign up success');
      expect(response.body.token).toBe('mockToken');
      expect(AdminService.doesAdminExists).toHaveBeenCalledWith('admin@example.com');
      expect(AdminService.createAdmin).toHaveBeenCalledWith({ email: 'admin@example.com', password: 'password123' });
    });

    it('should return 400 if admin already exists', async () => {
      (AdminService.doesAdminExists as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .post('/apis/auth/signup')
        .send({ email: 'admin@example.com', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('user already exists');
    });

    it('should return 500 if error occurs during sign up', async () => {
      (AdminService.doesAdminExists as jest.Mock).mockResolvedValue(false);
      (AdminService.createAdmin as jest.Mock).mockRejectedValue(new Error('DB error'));

      const response = await request(app)
        .post('/apis/auth/signup')
        .send({ email: 'admin@example.com', password: 'password123' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('error occurred');
    });
  });
});
