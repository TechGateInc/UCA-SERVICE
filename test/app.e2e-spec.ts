import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import mongoose from 'mongoose';
import { StudentSignUpDto } from 'src/auth/dto';

describe('App e2e', () => {
  let app: INestApplication;
  beforeAll(async () => {
    console.log(process.env.MONGODB_URI);

    const moduleRef = await Test.createTestingModule({
      imports: [
        AppModule,
        // MongooseModule.forRootAsync({
        //   useFactory: () => ({
        //     uri: 'mongodb+srv://manlikeemma:super-secret17$@cluster0.sieciu4.mongodb.net/?retryWrites=true&w=majority', // Use the loaded environment variable
        //   }),
        // }),
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(5600);

    pactum.request.setBaseUrl('http://localhost:5600');

    try {
      await mongoose.connect(process.env.MONGODB_URI);

      await mongoose.connection.collection('students').deleteMany({});

      console.log('Documents deleted successfully.');
    } catch (error) {
      console.error('Error deleting documents:', error);
    }
  }, 4000000);

  afterAll(async () => {
    await mongoose.disconnect();
  });
  describe('Auth', () => {
    describe('Signup', () => {
      const signUpDto: StudentSignUpDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        otherName: 'Janet',
        idNo: '19/0098',
        email: 'jane.doe@example.com',
        password: 'newpassword',
      };
      it('signup', () => {
        return pactum
          .spec()
          .post('/auth/student/signup')
          .withBody(signUpDto)
          .expectStatus(201);
      });
      it('should throw if first name is empty', () => {
        return pactum
          .spec()
          .post('/auth/student/signup')
          .withBody({
            lastName: signUpDto.lastName,
            otherName: signUpDto.otherName,
            idNo: signUpDto.idNo,
            email: signUpDto.email,
            password: signUpDto.password,
          })
          .expectStatus(400);
      });
      it('should throw if last name is empty', () => {
        return pactum
          .spec()
          .post('/auth/student/signup')
          .withBody({
            firstName: signUpDto.firstName,
            otherName: signUpDto.otherName,
            idNo: signUpDto.idNo,
            email: signUpDto.email,
            password: signUpDto.password,
          })
          .expectStatus(400);
      });
      it('should throw if other name is empty', () => {
        return pactum
          .spec()
          .post('/auth/student/signup')
          .withBody({
            firstName: signUpDto.firstName,
            lastName: signUpDto.lastName,
            idNo: signUpDto.idNo,
            email: signUpDto.email,
            password: signUpDto.password,
          })
          .expectStatus(400);
      });
      it('should throw if id number is empty', () => {
        return pactum
          .spec()
          .post('/auth/student/signup')
          .withBody({
            firstName: signUpDto.firstName,
            lastName: signUpDto.lastName,
            otherName: signUpDto.otherName,
            email: signUpDto.email,
            password: signUpDto.password,
          })
          .expectStatus(400);
      });
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/student/signup')
          .withBody({
            firstName: signUpDto.firstName,
            lastName: signUpDto.lastName,
            otherName: signUpDto.otherName,
            idNo: signUpDto.idNo,
            password: signUpDto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/student/signup')
          .withBody({
            firstName: signUpDto.firstName,
            lastName: signUpDto.lastName,
            otherName: signUpDto.otherName,
            idNo: signUpDto.idNo,
            email: signUpDto.email,
          })
          .expectStatus(400);
      });
      it('should throw body is empty', () => {
        return pactum.spec().post('/auth/student/signup').expectStatus(400);
      });
    });
    describe('Signin', () => {
      const loginDto: StudentSignUpDto = {
        email: 'jane.doe@example.com',
        password: 'newpassword',
      };
      it('sign in', () => {
        return pactum
          .spec()
          .post('/auth/student/login')
          .withBody(loginDto)
          .expectStatus(200)
          .stores('userAccessToken', 'access_token');
      });
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/student/login')
          .withBody({ password: loginDto.password })
          .expectStatus(400);
      });
      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/student/login')
          .withBody({ email: loginDto.email })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/student/login').expectStatus(400);
      });
    });
  });
  // describe('Attendance', () => {});
  // describe('Course', () => {});
  // describe('Department', () => {});
  // describe('Faculty', () => {});
  // describe('Timetable', () => {});
  // describe('Student', () => {});
  // describe('University', () => {});
  // describe('Venue', () => {});

  //   describe('logout',()=>{
  //   it('logout', () =>{
  //     return pactum
  //     .spec()
  //     .post('/auth/student/logout')
  //     .withHeaders({
  //       Authoriation:'Bearer $S{userAccessToken}'
  //     })
  //     .expectStatus(200);
  //   })
  // })
});
