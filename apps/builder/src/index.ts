import { createQueue, processQueue, type BuildSubmitData } from '@minemaker/realtime';
import { S3Client } from 'bun';
import { tmpdir } from 'os';
import { join } from 'path';
import * as unzipper from 'unzipper';

const queueName = 'BUILDS';
const queueSubject = 'queues.builds';

const r2 = new S3Client();

await createQueue(queueName, queueSubject);
const queue = await processQueue(queueName);

for await (const msg of queue) {
	const data = JSON.parse(msg.data.toString()) as BuildSubmitData;

	if (!data.gameId || !data.buildSrc || !data.buildId) {
		msg.ack();
		continue;
	}

	if (!(await r2.exists(data.buildSrc))) {
		msg.ack();
		continue;
	}

	const archivePath = join(tmpdir(), data.buildSrc);
	const dirPath = join(tmpdir(), data.buildId);
	const archive = Bun.file(archivePath);
	await archive.write(await r2.file(data.buildSrc).arrayBuffer());

	const directory = await unzipper.Open.file(archivePath);
	await directory.extract({ path: dirPath });

	const manifestFile = Bun.file(join(dirPath, 'manifest.json'));
	if (!manifestFile.exists()) {
		msg.ack();
		continue;
	}
	const manifest = await manifestFile.json();

	console.log(manifest);

	msg.ack();
}
