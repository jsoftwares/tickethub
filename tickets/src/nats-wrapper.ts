import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
    /**SINGLETON to create nats client & assign it as a property to d class. Note I'm not exporting d class
     *  but a single instance that would be shared across all our files (Singleton);
     *  I'm not defining _client property inside any contructor cos we're running our constructor at d export 
     * line below, so at this point, it's too early to try to create an actual Nats client & assign it to 
     * _client. Instead we do not want to create & assign _client property until we call a connect logic from 
     * inside index.ts.
     * Since TS wants _client property immiediately initialized in same line where we define it or inside a 
     * d constructor, so we add ? to _client otherwis we get a TS error highlight. ? tell TS d property can be 
     * undefined for some amount time.
     * Returning a Promise so that d aync-await syntax can be used when natsWrapper.connect() is called.
     * I added d ! to client property bcos by calling this._client inside a callback TS thinks we may have 
     * accidentally reassign or unassign this._client.
     * Since _client is marked as private; meaning it can't be accessed from other files & we actually want to
     * access it from other files, we create a TS getter to expose it to d other file. It also manages case of 
     * throwing an error when attempt to use NATS _client is made before it is ready to use(ie b4 we call .connect())
     * So we now replace this._client! in our Promise with our getter this.client. Hence d getter now defines
     * the client property on the instance   */
    
    private _client?: Stan;

    get client() {
        if (!this._client) {
            throw new Error('Cannot access NATS client before connecting');
        }
        return this._client;
    }

    connect(clusterId: string, clientId: string, url: string): Promise<void> {
        this._client = nats.connect(clusterId, clientId, {url});

        return new Promise( (resolve, reject) => {
            this.client.on('connect', () => {
                console.log('Connect to Nats');
                resolve();
            });
            // handles connection error during initial connection attempt.
            this.client.on('error', () => {
                reject();
            });
        })

    }
}

export const natsWrapper = new NatsWrapper();