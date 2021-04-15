import mongose from 'mongoose';

interface TicketAttrs{
    title: string;
    price: number;
    userId: string;
}


interface TicketDoc extends mongose.Document {
    title: string;
    price: number;
    userId: string;
}

interface TIcketModel extends mongose.Model<TicketDoc>{
    build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

/** adding a buld method to create new ticket instead of instantiating a new Ticket model is just to have TS 
 * help figure out d diff Types of attributes we're suppose to be providing
 */
ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs)
};

const Ticket = mongose.model<TicketDoc, TIcketModel>('Ticket', ticketSchema);

export {Ticket};