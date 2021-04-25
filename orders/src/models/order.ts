// import mongoose from 'mongoose';
// import { OrderStatus} from '@exchangepoint/common';
// import { TicketDoc } from './ticket';

// export { OrderStatus }; //with this we can access OrderStaus from this model hence we can do 1 import line on any file in Orders where we need to import both

// interface OrderAttrs {
//     userId: string;
//     status: OrderStatus;
//     expiresAt: Date;
//     ticket: TicketDoc;
// }

// interface OrderDoc extends mongoose.Document {
//     userId: string;
//     status: OrderStatus;
//     expiresAt: Date;
//     ticket: TicketDoc;
// }

// interface OrderModel extends mongoose.Model<OrderDoc> {
//     // We're saying this model should have 1 extra method called build()
//     build(attrs: OrderAttrs): OrderDoc
// }

// const orderSchema = new mongoose.Schema({
//     userId: {
//         type: String,
//         required: true
//     },
//     status: {
//         type: String,
//         required: true,
//         enum: Object.values(OrderStatus),    //ensures that anytime d value 4 this field is set, mongoose will ensure its one of those listed on the OrderStatus enum even if we have also set this in our interfaces above
//         default: OrderStatus.Created
//     },
//     expiresAt: {
//         type: mongoose.Schema.Types.Date
//     },
//     ticket: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Ticket',
//         reuqired: true
//     }
// }, {
//     toJSON: {
//         transform(doc, ret) {
//             ret.id = ret._id;
//             delete ret._id;
//         }
//     }
// });

// orderSchema.statics.build = (attrs: OrderAttrs) => {
//     return new Order(attrs);
// };

// const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);


// export { Order };


import mongoose from 'mongoose';
import { OrderStatus } from '@exchangepoint/common';
import { TicketDoc } from './ticket';

export { OrderStatus };

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
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

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
