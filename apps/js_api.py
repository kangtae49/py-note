class JsApi:
    def sayHelloTo(self, name):
        response = {'message': 'Hello {0}!'.format(name)}
        return response
    