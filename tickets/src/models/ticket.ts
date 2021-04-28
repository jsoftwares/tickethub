import mongose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttrs{
    title: string;
    price: number;
    userId: string;
}

/**version is listed here bcos we need to tell TS that d field is now part of properties of ticket Doc since we
 * have overwritten __v with version in our ticketSchema below. By default __v is part of d properties of a Doc, 
 * hence we could do ticket.__doc without listing it here as a property since TicketDoc extends mongoose.Document 
  */
interface TicketDoc extends mongose.Document {
    title: string;
    price: number;
    userId: string;
    version: number;
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
 
ticketSchema.set('versionKey', 'version'); //tells mongoose to track d verion of docs using d field "version" instead of d default __v. it's important this statement comes first.
ticketSchema.plugin(updateIfCurrentPlugin);

/** adding a buld method to create new ticket instead of instantiating a new Ticket model is just to have TS 
 * help figure out d diff Types of attributes we're suppose to be providing
 */
ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
};

const Ticket = mongose.model<TicketDoc, TIcketModel>('Ticket', ticketSchema);

export { Ticket };