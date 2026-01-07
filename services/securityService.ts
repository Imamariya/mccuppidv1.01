
export const securityService = {
  /**
   * Validates JWT token from the Authorization header.
   */
  async validateAuth(request: Request): Promise<{ userId: string; role: string } | null> {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

    const token = authHeader.split(' ')[1];
    
    // In production, use jose or jsonwebtoken to verify the JWT
    // For this environment, we decode the mock JWT format used in authService
    if (!token.includes('mock_jwt_')) return null;

    const parts = token.split('_');
    const role = parts[2] as 'user' | 'admin';
    const userId = parts[3] || 'anonymous';

    return { userId, role };
  },

  /**
   * Enforces role-based access control.
   */
  async authorize(request: Request, requiredRole: 'user' | 'admin'): Promise<{ userId: string } | Response> {
    const auth = await this.validateAuth(request);
    if (!auth) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    
    if (requiredRole === 'admin' && auth.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), { status: 403 });
    }

    return { userId: auth.userId };
  }
};
