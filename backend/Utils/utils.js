import bcrypt from 'bcrypt';

// Generate a salt and hash the refresh token
export const generateHash = async (item) => {
  try {    
    const saltRounds = 10;
    const hashedItem = await bcrypt.hash(item, saltRounds);
    return hashedItem;

  } catch (error) {
        console.error('Error generating hash:', error);
        throw error;
  }
};

export const getRefreshTokenHash = async (refreshToken) => {
  
  try {
        const hashRefreshToken = await generateHash(refreshToken);
        return hashRefreshToken;    

  } catch (error) {
        console.error('Error generating hash:', error);
        throw error;
  }   
}
