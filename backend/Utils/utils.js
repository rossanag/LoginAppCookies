import bcrypt from 'bcrypt';

// Generate a salt and hash the refresh token
export const generateHash = async (item) => {
  try {
    const saltRounds = 250; // Cost factor for bcrypt, you can adjust this based on your requirements
    const hashedItem = await bcrypt.hash(item, saltRounds);
    return hashedItem;
  } catch (error) {
        console.error('Error generating hash:', error);
        throw error;
  }
};


