---
layout: post
title: "android unit test with junit"
date: 2016-08-25 13:27:16 +0800
comments: true
categories: ['android', 'java']
---

Create Android unit tests using junit4.

<!-- more -->


## Test Types

When using Android Studio to write any of your tests, your test code must go into one of two different code directories (source sets). For each module in your project, Android Studio includes both source sets, corresponding to the following test types:

### Local unit tests

Located at *module-name/src/test/java/*.
These tests run on the local JVM and do not have access to functional Android framework APIs.

### Instrumented tests

Located at *module-name/src/androidTest/java/*.
These are all tests that must run on an Android hardware device or an Android emulator.

In the following, we will only focus on local unit test.

## Set Up Your Testing Environment

In your app's top-level build.gradle file, you need to specify these libraries as dependencies:

```
dependencies {
    // Required -- JUnit 4 framework
    testCompile 'junit:junit:4.12'
    // Optional -- Mockito framework
    testCompile 'org.mockito:mockito-core:1.10.19'
}
```

## Create a Local Unit Test Class

### Manualy create junit4 unit test

Your local unit test class should be written as a JUnit 4 test class. [JUnit](http://junit.org/junit4/) is the most popular and widely-used unit testing framework for Java. The latest version of this framework, JUnit 4, allows you to write tests in a cleaner and more flexible way than its predecessor versions. Unlike the previous approach to Android unit testing based on JUnit 3, with JUnit 4, you do not need to extend the junit.framework.TestCase class. You also do not need to prefix your test method name with the ‘test’ keyword, or use any classes in the junit.framework or junit.extensions package.

To create a basic JUnit 4 test class, create a Java class that contains one or more test methods. A test method begins with the @Test annotation and contains the code to exercise and verify a single functionality in the component that you want to test.

```
import org.junit.Test;
import java.util.regex.Pattern;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class EmailValidatorTest {

    @Test
    public void emailValidator_CorrectEmailSimple_ReturnsTrue() {
        assertThat(EmailValidator.isValidEmail("name@email.com"), is(true));
    }
    ...
}
```

### Auto create junit4 unit test with the help of Android Studio

Right click inside the class you are to test, and select *Go to -> Test* (Shift + Command + T), then select *create new test...*. You will see:

![auto_create_junit4_unit_test.png](/images/auto_create_junit4_unit_test.png)

In the above window, select the test class name, the methods you want to test, and some other helper methods like `setUp` and `tearDown`.

Then fill out all the test cases. 

### Some annotations

Annotation | Meaning | Note
---|---|---
@Test | for test cases | 
@Before | excute before every test case | 
@After | excute after every test case |
@BeforeClass | static, excute only once, before the first test case begin |
@AfterClass | see @BeforeClass |
@Rule |

## `Mock` and `Spy`


#### Difference between mock and spy

**Mock**: Mock will wrap the Class of an Type, not from an actual instance. The mock simply creates a bare-bones shell instance of the Class. In that case, each method implementation is mocked, unless specify `thenCallRealMethod()` in the `when(..)` clause.

**Spy**: Spy will wrap an existing instance. In this case, all method implementation are the real one, expect if you have defined a mocked behaviour with `when(..)`.

For `mock`:

```
Stock stock = mock(Stock.class);
when(stock.getPrice()).thenReturn(100.00);    // Mock implementation
when(stock.getQuantity()).thenReturn(200);    // Mock implementation
when(stock.getValue()).thenCallRealMethod();  // Real implementation
```

In that case, each method implementation is mocked, unless specify `thenCallRealMethod()` in the `when(..)` clause.

For `spy`:

```
Stock stock = spy(new Stock());
when(stock.getPrice()).thenReturn(100.00);    // Mock implementation
when(stock.getQuantity()).thenReturn(200);    // Mock implementation
// All other method call will use the real implementations
```

In that case, all method implementation are the real one, expect if you have defined a mocked behaviour with `when(..)`.

There is one important pitfall when you use `when(Object)` with spy like in the previous example. The real method will be called (because `stock.getPrice()` is evaluated before `when(..)` at runtime). This can be a problem if your method contains logic that should not be called. You can write the previous example like this:

```
Stock stock = spy(new Stock());
doReturn(100.00).when(stock).getPrice();    // Mock implementation
doReturn(200).when(stock).getQuantity();    // Mock implementation
// All other method call will use the real implementations
```

## Mock Android Dependencies

To do.

## Use Hamcrest for Assertion
Use [hamcrest](https://github.com/hamcrest/hamcrest-junit) to make the code more readable.

Instead of using:

```
assertEquals(expected, "the two values should be the same");
assertNotNull(object);
```

we can use:

```
assertThat(expected, equalTo("the two values should be the same"));
assertThat(object, is(NotNullValue()));
```

## References
[Getting Started with Testing](https://developer.android.com/training/testing/start/index.html): official site from Google.

[Use Mockito to mock some methods but not others](http://stackoverflow.com/questions/14970516/use-mockito-to-mock-some-methods-but-not-others)讲解Mock和Spy的用法，简单易懂。
