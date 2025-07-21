import { ApiBuild, DatabaseBuild } from '@minemaker/types';

export function convertToApiBuild(build: DatabaseBuild): ApiBuild {
	return {
		buildId: build.build_id,
		gameId: build.game_id,
		success: build.success,
		submittedAt: build.submitted_at,
		finishedAt: build.finished_at,
		userId: build.account_id,
		status: build.status,
		description: build.description,
		time: build.time,
		builderId: build.builder_id,
		submitterIp: build.submitter_ip
	};
}
