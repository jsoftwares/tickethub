import mongoose from 'mongoose';
import { Order, OrderStatus } from './order'; 
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttrs {
    id: string; // adding ID so that we can maintain same ID as d original ticket doc in Ticket service
    title: string;
    price: number;
}


// Exporting this interface so that it can be used to define the Type for our Ticket ref in order model
export interface TicketDoc extends mongoose.Document {
    // id: string;
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>;  //define d Type for a method we want to be able to access on each document
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0  //ensures we always have positive numbers on DB
    }
}, {
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

 /**docs in MongoDB is stored with d _id. its only when we take d record and turn it to JSON to be transmitted
   * over an Event that _id gets transformed to id (done by d transform() method here). if we save data gotten
   * from d publisher as it is, mongoDB will ignore d id property & assign a new  _id property; so to maintain
   * same IDs, we need to ensure when we create a new instance of d ticket using d build method in order service,
   * we take that id and assign it to the new record as _id
   */
ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
      _id: attrs.id,
      title: attrs.title,
      price: attrs.price
    });
};

// Add method that we can access on each ticket Document: Run query to look at all orders to find one with its 
// ticket field *=* d current ticket document, *&* d order status is *not* cancelled.
ticketSchema.methods.isReserved = async function() {
    // this === d ticket document that we'd just call isReserved() on
    const existingOrder = await Order.findOne({
        ticket: this.id,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete,
            ]
        }
    });

    //if we get NULL ! swtiches it to TRUE then ! to false. if there's an existing order, !! switches it to FALSE, TRUE  
    //this helps us return a a boolean from this method. equivalent to existingOrder ? true : false
    return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };