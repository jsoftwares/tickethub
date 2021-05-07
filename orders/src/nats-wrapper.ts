import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
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

// export a singleton nats client
export const natsWrapper = new NatsWrapper();