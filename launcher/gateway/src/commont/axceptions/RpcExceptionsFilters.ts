import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionsFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const rpcError = exception.getError();

    console.log('🔴 RPC Error:', JSON.stringify(rpcError, null, 2));

    // Manejar diferentes formatos de error
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    if (typeof rpcError === 'object' && rpcError !== null) {
      // Intentar obtener el código de estado
      status = rpcError['statusCode'] || rpcError['status'] || HttpStatus.INTERNAL_SERVER_ERROR;
      
      // Si status es string "error", usar 500
      if (typeof status === 'string') {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
      }
      
      message = rpcError['message'] || message;
      error = rpcError['error'] || error;
    } else if (typeof rpcError === 'string') {
      message = rpcError;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      error: error,
    });
  }
}
