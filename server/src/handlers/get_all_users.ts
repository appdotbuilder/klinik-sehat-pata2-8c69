import { type UserProfile } from '../schema';

export const getAllUsers = async (): Promise<UserProfile[]> => {
  // This is a placeholder declaration! Real code should be implemented here.
  // The goal of this handler is:
  // 1. Fetch all users from the database
  // 2. Return array of user profiles (without password_hash)
  // 3. Should be restricted to admin users only (middleware should handle this)
  
  return Promise.resolve([]);
};