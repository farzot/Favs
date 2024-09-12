import { ExecuterEntity } from "src/core/entity/executer.entity";

export interface ICurrentExecuter {
	executer: ExecuterEntity;
	business_id?: string;
	// store_id?: string;
	// avaliable_stores?: any[];
}
