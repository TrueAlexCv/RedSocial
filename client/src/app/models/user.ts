export class User {
    constructor(
        public _id: string,
        public email: string,
        public password: string,
        public nick: String,
        public name: String,
        public image: String,
        public banner: String,
        public biography: String,
        public role: String
    ) {}
}
