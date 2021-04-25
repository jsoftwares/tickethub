import mongoose from 'mongoose';

interface TicketAttrs {
    id: string;
    title: string;
    price: number
}


// Exporting this interface so that it can be used to define the Type for our Ticket ref in Order model
export interface TicketDoc extends mongoose.Document {
    id: string;
    title: string;
    price: number
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc
}

const ticketSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0  //ensures we also have positive numbers on DB
    }
}, {
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id;
        }
    }
});


ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };