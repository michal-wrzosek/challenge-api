import { Schema, model, Document, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface ProviderProps {
  providerId: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  hospitalReferralRegionDesc: string;
  totalDischarges: number;
  avgCoveredCharges: number;
  avgTotalPayments: number;
  avgMedicarePayments: number;
  drgDefinition: string;
}

export interface ProviderModelProps extends ProviderProps, Document {}
export interface ProviderModel<T extends Document> extends PaginateModel<T> {
  serialize: (props: ProviderModelProps) => ProviderProps;
}

const providerSchema: Schema = new Schema({
  providerId: { type: String, required: true },
  name: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipcode: { type: String, required: true },
  hospitalReferralRegionDesc: { type: String, required: true },
  totalDischarges: { type: Number, required: true },
  avgCoveredCharges: { type: Number, required: true },
  avgTotalPayments: { type: Number, required: true },
  avgMedicarePayments: { type: Number, required: true },
  drgDefinition: { type: String, required: true },
});

providerSchema.statics.serialize = (
  provider: ProviderProps
): ProviderProps => ({
  providerId: provider.providerId,
  name: provider.name,
  street: provider.street,
  city: provider.city,
  state: provider.state,
  zipcode: provider.zipcode,
  hospitalReferralRegionDesc: provider.hospitalReferralRegionDesc,
  totalDischarges: provider.totalDischarges,
  avgCoveredCharges: provider.avgCoveredCharges,
  avgTotalPayments: provider.avgTotalPayments,
  avgMedicarePayments: provider.avgMedicarePayments,
  drgDefinition: provider.drgDefinition,
});

providerSchema.plugin(mongoosePaginate);

const Provider = model("Provider", providerSchema) as ProviderModel<
  ProviderModelProps
>;

export default Provider;
