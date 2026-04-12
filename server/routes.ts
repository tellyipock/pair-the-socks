import { Router } from 'express';
import type { Request, Response } from 'express';

export type ClientErrorReport = { message: string; url: string; timestamp: string } & Record<string, unknown>;

export const apiRoutes = Router();

apiRoutes.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, data: { status: 'healthy', timestamp: new Date().toISOString() } });
});

apiRoutes.post('/client-errors', (req: Request, res: Response) => {
  try {
    const e = req.body as ClientErrorReport;
    console.error(
      '[CLIENT ERROR]',
      JSON.stringify(
        {
          timestamp: e.timestamp || new Date().toISOString(),
          message: e.message,
          url: e.url,
          stack: e.stack,
          componentStack: e.componentStack,
          errorBoundary: e.errorBoundary,
        },
        null,
        2
      )
    );
    res.json({ success: true });
  } catch (error) {
    console.error('[CLIENT ERROR HANDLER] Failed:', error);
    res.status(500).json({ success: false, error: 'Failed to process' });
  }
});

// Add more routes below this line. DO NOT MODIFY CORS OR ERROR HANDLERS above.
apiRoutes.get('/test', (_req: Request, res: Response) => {
  res.json({ success: true, data: { name: 'this works' } });
});

// 404 handler for unmatched /api/* routes
apiRoutes.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Not Found' });
});
