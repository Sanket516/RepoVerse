import mongoose from 'mongoose';

export default function connectMongoDB() {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('MONGODB connected successfully');
        })
        .catch(error => {
            console.log('Error connecting to MongoDB: ', error.message);
        });
}
