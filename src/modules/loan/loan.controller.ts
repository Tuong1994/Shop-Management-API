import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query, UseGuards } from '@nestjs/common';
import { LoanService } from './loan.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { LoanDto, UserLoanDto } from './loan.dto';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { EPermission, ERole } from '../user/user.enum';
import { RoleGuard } from 'src/common/guard/role.guard';
import { Permission } from 'src/common/decorator/permission.decorator';
import { PermissionGuard } from 'src/common/guard/permission.guard';

@Controller('api/loan')
export class LoanController {
  constructor(private loanService: LoanService) {}

  @Get('list')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getLoans(@Query() query: QueryDto) {
    return this.loanService.getLoans(query);
  }

  @Get('userLoans')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getUserLoans(@Query() query: QueryDto) {
    return this.loanService.getUserLoans(query);
  }

  @Get('detail')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getLoan(@Query() query: QueryDto) {
    return this.loanService.getLoan(query);
  }

  @Post('create')
  @Roles(ERole.MANAGER)
  @Permission(EPermission.CREATE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @HttpCode(HttpStatus.CREATED)
  createLoan(@Body() loan: LoanDto) {
    return this.loanService.createLoan(loan);
  }

  @Post('createUserLoan')
  @Roles(ERole.MANAGER)
  @Permission(EPermission.CREATE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @HttpCode(HttpStatus.CREATED)
  createUserLoan(@Body() userLoan: UserLoanDto) {
    return this.loanService.createUserLoan(userLoan);
  }

  @Post('payLoan')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  payLoan(@Query() query: QueryDto) {
    return this.loanService.payLoan(query);
  }

  @Put('update')
  @Roles(ERole.MANAGER)
  @Permission(EPermission.UPDATE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  updateLoan(@Query() query: QueryDto, @Body() loan: LoanDto) {
    return this.loanService.updateLoan(query, loan);
  }

  @Delete('remove')
  @Roles(ERole.MANAGER)
  @Permission(EPermission.REMOVE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  removeLoans(@Query() query: QueryDto) {
    return this.loanService.removeLoans(query);
  }

  @Delete('removeUserLoans')
  @Roles(ERole.MANAGER)
  @Permission(EPermission.REMOVE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  removeUserLoans(@Query() query: QueryDto) {
    return this.loanService.removeUserLoans(query);
  }

  @Delete('removePermanent')
  @Roles(ERole.MANAGER)
  @Permission(EPermission.REMOVE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  removeLoansPermenant(@Query() query: QueryDto) {
    return this.loanService.removeLoansPermenant(query);
  }

  @Delete('removeUserLoansPermanent')
  @Roles(ERole.MANAGER)
  @Permission(EPermission.REMOVE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  removeUserLoansPermenant(@Query() query: QueryDto) {
    return this.loanService.removeUserLoansPermenant(query);
  }

  @Post('restore')
  @Roles(ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  restoreLoans() {
    return this.loanService.restoreLoans();
  }

  @Post('restoreUserLoans')
  @Roles(ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  restoreUserLoans() {
    return this.loanService.restoreUserLoans();
  }
}
