// import mongoose from 'mongoose';
// import { Order, OrderStatus } from './order'; 

// interface TicketAttrs {
//     // id: string;
//     title: string;
//     price: number;
// }


// // Exporting this interface so that it can be used to define the Type for our Ticket ref in Order model
// export interface TicketDoc extends mongoose.Document {
//     // id: string;
//     title: string;
//     price: number;
//     isReserved(): Promise<boolean>;  //define d Type for a method we want to be able to access on each document
// }

// interface TicketModel extends mongoose.Model<TicketDoc> {
//     build(attrs: TicketAttrs): TicketDoc
// }

// const ticketSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     price: {
//         type: Number,
//         required: true,
//         min: 0  //ensures we also have positive numbers on DB
//     }
// }, {
//     toJSON: {
//         transform(doc, ret){
//             ret.id = ret._id;
//             delete ret._id;
//         }
//     }
// });


// ticketSchema.statics.build = (attrs: TicketAttrs) => {
//     return new Ticket(attrs);
// };

// // Add method that we can access on each ticket Document: Run query to look at all orders to find one with its 
// // ticket field *=* d current ticket document, *&* d order status is *not* cancelled.
// ticketSchema.methods.isReserved = async function() {
//     // this === d ticket document that we'd just call isReserved() on
//     const existingOrder = await Order.findOne({
//         ticket: this,
//         status: {
//             $in: [
//                 OrderStatus.Created,
//                 OrderStatus.AwaitingPayment,
//                 OrderStatus.Complete
//             ]
//         }
//     });

//     //if we get NULL ! swtiches it to TRUE then ! to false. if there's an existing order, !! switches it to FALSE, TRUE  
//     //this helps us return a a boolean from this method. equivalent to existingOrder ? true : false
//     return !!existingOrder;
// };

// const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

// export { Ticket };


import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

interface TicketAttrs {
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};
ticketSchema.methods.isReserved = async function () {
  // this === the ticket document that we just called 'isReserved' on
  const existingOrder = await Order.findOne({
    ticket: this.id,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
