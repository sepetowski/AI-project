export interface ApiError {
	data: {
		message: string;
	};

	statusCode?: number;
}
