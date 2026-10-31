package com.example.services;

class AuthServiceFakeTest extends AuthServiceContract {
    @Override
    protected InterAuthService service() {
        return new AuthServiceFake();
    }
}
