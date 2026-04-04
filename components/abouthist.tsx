import React from 'react';
import Link from "next/link"

const AboutHist = () => {
  return (
      <section className="py-1 bg-background">
      <div className="container mx-auto px-4">
        {/* 우리의 발자취 (연혁) 섹션 */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center" id="history">
            우리의 발자취
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto px-4">
            2010년 설립 이후 소상공인의 권익 보호와 경제적 지위 향상을 위해 끊임없이 노력해왔습니다.
          </p>

          <div className="relative max-w-4xl mx-auto">
            {/* Center Line  w-[2px]:모바일,  md:w-1:PC */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full flex z-0">
              <div className="w-[4px] md:w-1.5 h-full bg-gradient-to-b from-[#002B6B] to-[#004EA2]"></div>
              <div className="w-[5px] md:w-1.5 h-full bg-gradient-to-b from-[#005BBB] to-[#007BFF]"></div>
              <div className="w-[4px] md:w-1.5 h-full bg-gradient-to-b from-[#1EAD63] to-[#2ECC71]"></div>
            </div>
            {/* div className="relative space-y-6 박스간 간격, 박스간 마이너스 간격mt-[-15px] */}
            <div className="relative space-y-0">
              {/* 2010 - Left */}
              <div className="flex items-center w-full min-h-[100px]"> {/* 높이는 고정값(h-[100px])보다는 내용에 따라 늘어날 수 있도록 **min-h (최소 높이)**를 사용,중앙선과 박스 사이의 간격은 pr-[12px] */}            
                <div className="w-1/2 pr-[6px] md:pr-10 flex justify-end">
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 md:p-4 w-full max-w-[180px] md:max-w-sm shadow-sm">{/* max-w-[180px]모바일 180~200px 사이가 적당, md:max-w-xs (PC, 320px): PC  */}
                    <h3 className="text-base md:text-2xl font-bold text-primary mb-1 text-right">2010년</h3>
                    <ul className="text-[13px] md:text-sm text-muted-foreground space-y-0.5 text-right leading-tight tracking-tighter">
                      <li>• 법인설립 및 중소벤처기업부 인가</li>
                      <li>• 법정단체 등록</li>
                    </ul>
                  </div>
                </div>
                <div className="w-1/2"></div>
              </div>

              {/* 2013 - Right */}
              <div className="flex items-center w-full min-h-[100px] mt-[-20px]">
                <div className="w-1/2"></div>
                <div className="w-1/2 pl-[6px] md:pl-10 flex justify-start">
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 md:p-4 w-full max-w-[180px] md:max-w-sm shadow-sm">
                    <h3 className="text-base md:text-2xl font-bold text-primary mb-1">2013년</h3>
                    <ul className="text-[13px] md:text-sm text-muted-foreground space-y-0.5 text-left leading-tight tracking-tighter">
                      <li>• 여신금융협회 공용서비스센터 계약 체결</li>
                      <li>• 여신금융협회 매출전표수거센터 위탁계약 체결</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 2014 - Left */}
              <div className="flex items-center w-full min-h-[100px] mt-[-20px]">
                <div className="w-1/2 pr-[6px] md:pr-10 flex justify-end">
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 md:p-4 w-full max-w-[180px] md:max-w-sm shadow-sm">
                    <h3 className="text-base md:text-2xl font-bold text-primary mb-1 text-right">2014년</h3>
                    <ul className="text-[13px] md:text-sm text-muted-foreground space-y-0.5 text-right leading-tight tracking-tighter">
                      <li>• 고용노동부 매출전표수거 시간선택제 공공근로사업 MOU 체결</li>
                      <li>• 소상공인연합회의 소상공인지원사업 MOU 체결</li>
                      <li>• 기획재정부 지정기부금단체 등록</li>
                    </ul>
                  </div>
                </div>
                <div className="w-1/2"></div>
              </div>

              {/* 2015 - Right */}
              <div className="flex items-center w-full min-h-[100px] mt-[-20px]">
                <div className="w-1/2"></div>
                <div className="w-1/2 pl-[6px] md:pl-10 flex justify-start">
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 md:p-4 w-full max-w-[180px] md:max-w-sm shadow-sm">
                    <h3 className="text-base md:text-2xl font-bold text-primary mb-1">2015년</h3>
                    <ul className="text-[13px] md:text-sm text-muted-foreground space-y-0.5 text-left leading-tight tracking-tighter">
                      <li>• 코레일네트웍스 - 소상공인전용 VAN구축 제휴계약서 체결</li>
                      <li>• 여신금융협회 영세가맹점 IC단말기 전환지원사업 위탁사업자 선정</li>
                      <li>• 국내 신용카드사 VAN서비스 중개계약 완료</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 2016 - Left */}
              <div className="flex items-center w-full min-h-[100px] mt-[-20px]">
                <div className="w-1/2 pr-[6px] md:pr-10 flex justify-end">
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 md:p-4 w-full max-w-[180px] md:max-w-sm shadow-sm">
                    <h3 className="text-base md:text-2xl font-bold text-primary mb-1 text-right">2016년</h3>
                    <ul className="text-[13px] md:text-sm text-muted-foreground space-y-0.5 text-right leading-tight tracking-tighter">
                      <li>• 금융감독원 VAN인가 취득</li>
                      <li>• 국세청 현금영수증사업자 인가 취득</li>
                    </ul>
                  </div>
                </div>
                <div className="w-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        {/* 조직 현황 섹션 */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center" id="organization">
            조직 현황
          </h2>
          <div className="flex justify-center">
            <img
              src="/images/org.png"
              alt="조직도"
              className="w-full max-w-4xl rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHist;
