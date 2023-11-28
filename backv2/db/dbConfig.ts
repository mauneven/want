import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const uri = 'mongodb+srv://development:6BEaPzIzIb2CMSom@cluster0.jhnshdi.mongodb.net/?retryWrites=true&w=majority';
        await mongoose.connect(uri);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        process.exit(1);
    }
};

export default connectDB;