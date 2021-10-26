# Smart Contract Development Study

## Objective

> 스마트 컨트랙트 개발을 배워서, DAPP 생태계를 이해해보기

## Resources

1. **개발환경 IDE**

    REMIX IDE와 WebStorm with Solidty Plugins 중 익숙한 WebStorm을 선택. 

2. **Development & Testing 프레임워크**
    
    조사해본 프레임워크 중 [TRUFFLE](https://www.trufflesuite.com/ )이 가장 성숙도가 높아서 이용하였음
    ````shell
    npm install -g truffle 
    ````

3. **프라이빗 블록체인 엔진**
    가나슈([GanaChe](https://github.com/trufflesuite/ganache-ui/releases ))는 TestRPC 환경을 제공.

    보통 개발은 TestRPC -> TestNet -> MainNet 순으로 진행. 
    - TestRPC : 로컬 개발 환경
    - TestNet : 개발 완료 후 MainNet과 동일한 환경 But 실제 이더나 가스등의 지불 X
    - MainNet : 실제 서비스에 사용할 수 있도록 배포