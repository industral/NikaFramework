describe("Controller", function() {

  const URL = {
    PAGE_WITH_SLASH: '/Product/',
    PAGE: '/Product',
    PAGE_WITH_PARAMETER: '/Product/id:2',
    PAGE_WITH_PARAMETERS: '/Product/id:2,qwe:3',
    PAGE_WITH_COMA_PARAMETERS: '/Product/id:2,qwe:(1~2~3)',
    PAGE_WITH_COMA_PARAMETERS_2: '/Product/qwe:(1~2~3),id2:true',
    PAGE_WITH_COMA_PARAMETERS_P: '/Product/id:2,qwe:(1~2~3)',
    PAGE_WITH_PARAMETERS_AND_SEARCH_QUERY: '/Product/id:2,qwe:3?search=some text',
    PAGE_WITH_PARAMETERS_AND_HASH: '/Product/id:2,qwe:3#olololo',
    PAGE_WITH_HASH_AND_SLASH: '/Product/#olololo',
    PAGE_WITH_HASH: '/Product#olololo',
    WINDOW_LOCATION_MOCK: '/Product/id:2,qwe:3'
  };

  const URL_OBJECT = {
    PAGE: {
      pageName: 'Category'
    },
    PAGE_AND_EMPTY_PARAMS: {
      pageName: 'Account',
      params: {}
    },
    PAGE_AND_PARAM: {
      pageName: 'Account',
      params: {
        message: 'hello'
      }
    },
    PAGE_AND_PARAMS: {
      pageName: 'Account',
      params: {
        id: 3,
        message: 'hello'
      }
    },
    PAGE_AND_PARAMS_SET: {
      pageName: 'Account',
      params: {
        id: '(1~3~5)',
        message: 'hello'
      }
    },
    DEFAULT_PAGE: {
      pageName: 'Home'
    },
    DEFAULT_PAGE_WITH_PARAMS: {
      pageName: 'Home',
      params: {
        id: 1
      }
    }
  };

  describe("getURLObject", function() {

    it("should handle URL with pageName with slash", function() {
      var result = nkf.core.Controller.getURLObject(URL.PAGE_WITH_SLASH);

      expect(result.pageName).toEqual('Product');
    });

    it("should handle URL with pageName", function() {
      var result = nkf.core.Controller.getURLObject(URL.PAGE);

      expect(result.pageName).toEqual('Product');
    });

    it("should handle URL with parameter", function() {
      var result = nkf.core.Controller.getURLObject(URL.PAGE_WITH_PARAMETER);

      expect(result.pageName).toEqual('Product');
      expect(result.params.id).toEqual('2');
    });

    it("should handle URL with parameters", function() {
      var result = nkf.core.Controller.getURLObject(URL.PAGE_WITH_PARAMETERS);

      expect(result.pageName).toEqual('Product');
      expect(result.params.id).toEqual('2');
      expect(result.params.qwe).toEqual('3');
    });

    it("should handle URL with parameters [] like", function() {
      var result = nkf.core.Controller.getURLObject(URL.PAGE_WITH_COMA_PARAMETERS);

      expect(result.pageName).toEqual('Product');
      expect(result.params.id).toEqual('2');
      expect(result.params.qwe).toEqual('(1~2~3)');
    });

    it("should handle URL with parameters [] like", function() {
      var result = nkf.core.Controller.getURLObject(URL.PAGE_WITH_COMA_PARAMETERS_2);

      expect(result.pageName).toEqual('Product');
      expect(result.params.id2).toEqual('true');
      expect(result.params.qwe).toEqual('(1~2~3)');
    });

    it("should handle URL with parameters () like", function() {
      var result = nkf.core.Controller.getURLObject(URL.PAGE_WITH_COMA_PARAMETERS_P);

      expect(result.pageName).toEqual('Product');
      expect(result.params.id).toEqual('2');
      expect(result.params.qwe).toEqual('(1~2~3)');
    });

    it("should handle URL with parameters with search queries", function() {
      var result = nkf.core.Controller.getURLObject(URL.PAGE_WITH_PARAMETERS_AND_SEARCH_QUERY);

      expect(result.pageName).toEqual('Product');
      expect(result.params.id).toEqual('2');
      expect(result.params.qwe).toEqual('3');
    });

    it("should handle URL with parameters with hash", function() {
      var result = nkf.core.Controller.getURLObject(URL.PAGE_WITH_PARAMETERS_AND_HASH);

      expect(result.pageName).toEqual('Product');
      expect(result.params.id).toEqual('2');
      expect(result.params.qwe).toEqual('3');
    });

    it("should handle URL with hash with slash", function() {
      var result = nkf.core.Controller.getURLObject(URL.PAGE_WITH_HASH_AND_SLASH);

      expect(result.pageName).toEqual('Product');
      expect(result.params).toEqual({});
    });

    it("should handle URL with parameters with hash", function() {
      var result = nkf.core.Controller.getURLObject(URL.PAGE_WITH_HASH);

      expect(result.pageName).toEqual('Product');
      expect(result.params).toEqual({});
    });


    it("should handle URL with parameters", function() {
      history.pushState({}, '', URL.PAGE_WITH_PARAMETERS);

      var result = nkf.core.Controller.getURLObject();

      expect(result.pageName).toEqual('Product');
      expect(result.params.id).toEqual('2');
      expect(result.params.qwe).toEqual('3');
    });

  });

  describe("getURLFromObject", function() {

    it("should set pageName", function() {
      var result = nkf.core.Controller.getURLFromObject(URL_OBJECT.PAGE);

      var testResult = nkf.core.Controller.getURLObject(result);
      expect(testResult.pageName).toEqual('Category');
    });

    it("should set pageName and empty params", function() {
      var result = nkf.core.Controller.getURLFromObject(URL_OBJECT.PAGE_AND_EMPTY_PARAMS);

      var testResult = nkf.core.Controller.getURLObject(result);

      expect(testResult.pageName).toEqual('Account');
      expect(testResult.params).toEqual({});
    });

    it("should set pageName and param", function() {
      var result = nkf.core.Controller.getURLFromObject(URL_OBJECT.PAGE_AND_PARAM);

      var testResult = nkf.core.Controller.getURLObject(result);

      expect(testResult.pageName).toEqual('Account');
      expect(testResult.params.message).toEqual('hello');
    });

    it("should set pageName and params", function() {
      var result = nkf.core.Controller.getURLFromObject(URL_OBJECT.PAGE_AND_PARAMS);

      var testResult = nkf.core.Controller.getURLObject(result);
      console.log(result);

      expect(testResult.pageName).toEqual('Account');
      expect(testResult.params.message).toEqual('hello');
      expect(testResult.params.id).toEqual('3');
    });

    it("should set pageName and params set", function() {
      var result = nkf.core.Controller.getURLFromObject(URL_OBJECT.PAGE_AND_PARAMS_SET);

      var testResult = nkf.core.Controller.getURLObject(result);

      expect(testResult.pageName).toEqual('Account');
      expect(testResult.params.message).toEqual('hello');
      expect(testResult.params.id).toEqual('(1~3~5)');
    });

    it("should return url for default page as /", function() {
      var result = nkf.core.Controller.getURLFromObject(URL_OBJECT.DEFAULT_PAGE);
      expect(result).toEqual('/');

      var testResult = nkf.core.Controller.getURLObject(result);

      expect(testResult.pageName).toEqual('Home');
    });

    it("should return url for default page as / with parameters", function() {
      var result = nkf.core.Controller.getURLFromObject(URL_OBJECT.DEFAULT_PAGE_WITH_PARAMS);
      expect(result).toEqual('/id:1');

      var testResult = nkf.core.Controller.getURLObject(result);

      expect(testResult.pageName).toEqual('Home');
      expect(testResult.params.id).toEqual('1');
    });

  });

});