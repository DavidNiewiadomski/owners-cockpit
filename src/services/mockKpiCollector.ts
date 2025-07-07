// Mock KPI Collector Service for Development Testing
// This simulates the Node.js KPI collector service when it's not available

export interface MockSummaryResponse {
  success: boolean;
  summary: string;
}

export class MockKpiCollectorService {
  private static instance: MockKpiCollectorService;

  static getInstance(): MockKpiCollectorService {
    if (!MockKpiCollectorService.instance) {
      MockKpiCollectorService.instance = new MockKpiCollectorService();
    }
    return MockKpiCollectorService.instance;
  }

  async generateSummary(companyId: string, period: string): Promise<MockSummaryResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const summaries = this.getMockSummaries();
    const summary = summaries[companyId] || this.getDefaultSummary(companyId, period);

    return {
      success: true,
      summary
    };
  }

  private getMockSummaries(): Record<string, string> {
    return {
      '11111111-1111-1111-1111-111111111111': `# Metropolitan Steel Works - Q4 2024 Performance Brief

## Executive Summary
Metropolitan Steel Works has demonstrated exceptional performance in Q4 2024, achieving an overall score of 95.2/100. This represents a significant improvement from the previous quarter and establishes them as a top-tier performer in structural steel fabrication and installation.

## Key Performance Indicators
- **Quality Score**: 95.8% - Consistently delivering high-quality structural elements
- **On-Time Delivery**: 98.2% - Exceptional schedule adherence with minimal delays
- **Budget Adherence**: 99.1% - Outstanding cost control, finishing under budget
- **Safety Record**: Zero incidents - Perfect safety performance this quarter
- **Customer Satisfaction**: 4.9/5 - Highest satisfaction rating achieved

## Strengths
1. **Safety Excellence**: Zero safety incidents demonstrates strong safety culture
2. **Cost Management**: Consistent under-budget performance shows excellent project control
3. **Quality Delivery**: High-quality work with minimal defects or rework
4. **Schedule Reliability**: Exceptional on-time delivery builds client confidence

## Areas for Improvement
1. **Response Time**: While good at 1.5 hours, could aim for sub-hour response
2. **Change Order Management**: Continue to minimize change orders through better planning

## Risk Assessment
**Low Risk** - All indicators show strong performance with positive trends. No significant risks identified.

## Action Items
1. Continue current quality management practices
2. Share safety best practices with other contractors
3. Maintain current project management methodologies
4. Consider expanding capacity for additional projects`,

      '22222222-2222-2222-2222-222222222222': `# Premier Concrete Co. - Q4 2024 Performance Brief

## Executive Summary
Premier Concrete Co. continues to excel as our premier concrete contractor, achieving an outstanding overall score of 97.8/100 in Q4 2024. Their consistent performance across all metrics makes them our top-rated concrete supplier.

## Key Performance Indicators
- **Quality Score**: 97.2% - Superior concrete quality and finish work
- **On-Time Delivery**: 99.5% - Exceptional schedule performance with early completions
- **Budget Adherence**: 98.7% - Excellent cost control and value delivery
- **Safety Record**: Zero incidents - Perfect safety record maintained
- **Customer Satisfaction**: 4.8/5 - High satisfaction across all project stakeholders

## Strengths
1. **Quality Excellence**: Industry-leading concrete quality and finishing
2. **Reliability**: Exceptional schedule and budget performance
3. **Safety Leadership**: Zero incidents with proactive safety measures
4. **Technical Innovation**: Advanced concrete techniques and materials

## Areas for Improvement
1. **Response Time**: Maintain current 2.1-hour average response time
2. **Documentation**: Continue detailed progress reporting practices

## Risk Assessment
**Very Low Risk** - Exceptional performance across all metrics. Preferred contractor status.

## Action Items
1. Maintain current excellence standards
2. Explore opportunities for expanded partnership
3. Consider joint ventures for large-scale projects
4. Share best practices with other trades`,

      '33333333-3333-3333-3333-333333333333': `# Advanced MEP Solutions - Q4 2024 Performance Brief

## Executive Summary
Advanced MEP Solutions has experienced significant performance challenges in Q4 2024, achieving an overall score of 71.8/100. This represents a concerning decline from previous periods and requires immediate corrective action.

## Key Performance Indicators
- **Quality Score**: 78.5% - Below acceptable standards, multiple quality issues
- **On-Time Delivery**: 82.3% - Significant schedule delays affecting project timeline
- **Budget Adherence**: 85.2% - Cost overruns impacting project profitability
- **Safety Record**: 3 incidents - Safety performance requires immediate attention
- **Customer Satisfaction**: 3.8/5 - Below average satisfaction indicates service issues

## Strengths
1. **Technical Capability**: Skilled in complex MEP system design and installation
2. **Equipment Resources**: Well-equipped for mechanical and electrical work

## Areas for Improvement
1. **Quality Control**: Implement enhanced QA/QC procedures immediately
2. **Project Management**: Strengthen schedule and cost management systems
3. **Safety Culture**: Immediate safety training and culture improvement required
4. **Communication**: Improve response times and client communication protocols

## Risk Assessment
**High Risk** - Multiple performance indicators below standards. Performance improvement plan required.

## Action Items
1. **Immediate (7 days)**: Conduct comprehensive safety audit and implement corrective measures
2. **30 Days**: Develop and implement quality improvement plan with measurable targets
3. **60 Days**: Review and strengthen project management procedures and training
4. **90 Days**: Performance review and reassessment of contractor qualification status`,

      '44444444-4444-4444-4444-444444444444': `# Glass Tech Systems - Q4 2024 Performance Brief

## Executive Summary
Glass Tech Systems has delivered solid performance in Q4 2024, achieving an overall score of 87.3/100. While meeting most project requirements, there are opportunities for improvement to reach preferred contractor status.

## Key Performance Indicators
- **Quality Score**: 89.7% - Good quality glazing work with minor defects
- **On-Time Delivery**: 91.8% - Generally meeting deadlines with occasional delays
- **Budget Adherence**: 93.4% - Reasonable cost control with moderate variances
- **Safety Record**: 1 incident - One minor glazing-related incident this quarter
- **Customer Satisfaction**: 4.3/5 - Good satisfaction level with room for improvement

## Strengths
1. **Technical Expertise**: Strong capabilities in curtain wall and glazing systems
2. **Project Coordination**: Good coordination with other trades
3. **Material Quality**: High-quality glass and glazing materials used

## Areas for Improvement
1. **Schedule Management**: Improve project scheduling and milestone tracking
2. **Quality Control**: Reduce defect rates through enhanced inspection procedures
3. **Cost Management**: Better cost estimation and change order management
4. **Safety Protocols**: Strengthen safety procedures for high-rise glazing work

## Risk Assessment
**Medium Risk** - Generally acceptable performance with areas requiring attention.

## Action Items
1. Implement enhanced project scheduling and tracking systems
2. Develop comprehensive quality control checklists for glazing work
3. Provide additional safety training for glazing crews
4. Establish regular project review meetings to address issues early`,

      '55555555-5555-5555-5555-555555555555': `# Elite Electrical Corp - Q4 2024 Performance Brief

## Executive Summary
Elite Electrical Corp has delivered outstanding performance in Q4 2024, achieving an overall score of 93.8/100. Their consistent excellence across electrical installations makes them a valued partner for complex projects.

## Key Performance Indicators
- **Quality Score**: 94.3% - High-quality electrical installations with minimal rework
- **On-Time Delivery**: 96.7% - Excellent schedule performance with early completions
- **Budget Adherence**: 97.9% - Strong cost control and accurate estimating
- **Safety Record**: Zero incidents - Perfect safety record for electrical work
- **Customer Satisfaction**: 4.7/5 - High satisfaction with electrical systems and service

## Strengths
1. **Safety Excellence**: Zero electrical safety incidents demonstrates strong safety culture
2. **Technical Proficiency**: Advanced electrical systems and smart building integration
3. **Quality Assurance**: Comprehensive testing and commissioning procedures
4. **Project Coordination**: Excellent coordination with other mechanical trades

## Areas for Improvement
1. **Response Time**: Maintain current 1.8-hour average response time
2. **Documentation**: Continue detailed as-built documentation practices
3. **Innovation**: Explore emerging electrical technologies and systems

## Risk Assessment
**Low Risk** - Strong performance across all metrics. Preferred electrical contractor.

## Action Items
1. Continue current quality and safety management practices
2. Explore opportunities for expanded electrical services
3. Consider leadership role in smart building integration projects
4. Maintain current standards while exploring efficiency improvements`
    };
  }

  private getDefaultSummary(companyId: string, period: string): string {
    return `# Performance Brief - ${period}

## Executive Summary
Performance data analysis for company ${companyId} in ${period}. This is a generated summary based on available KPI data.

## Key Performance Indicators
Performance metrics have been analyzed across multiple dimensions including quality, schedule, budget, safety, and customer satisfaction.

## Areas for Review
1. Quality management procedures
2. Schedule adherence and planning
3. Budget control and cost management
4. Safety protocols and incident prevention
5. Customer communication and satisfaction

## Action Items
1. Review current performance metrics
2. Identify areas for improvement
3. Develop targeted improvement plans
4. Monitor progress and adjust as needed`;
  }

  // Check if the real KPI collector service is available
  async isServiceAvailable(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:3001/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export const mockKpiCollectorService = MockKpiCollectorService.getInstance();
