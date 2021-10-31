//
//  RCTBridgeModule.m
//  reactnativecpuweather
//
//  Created by Sergiu Finciuc on 29/10/2021.
//

#import <Foundation/Foundation.h>
#import "RCTCpuModule.h"

#import <mach/mach.h>
#import <assert.h>

#import <sys/sysctl.h>
#import <sys/types.h>
#import <sys/param.h>
#import <sys/mount.h>
#import <mach/mach.h>
#import <mach/processor_info.h>
#import <mach/mach_host.h>

@implementation RCTCpuModule

RCT_EXPORT_MODULE(RCTCpuModule);

RCT_EXPORT_METHOD(getUsage: (RCTResponseSenderBlock)callback)
{
  NSInteger eventId = 10;
  
//  kern_return_t kr;
//  task_info_data_t tinfo;
//  mach_msg_type_number_t task_info_count;
//
//  task_info_count = TASK_INFO_MAX;
//  kr = task_info(mach_task_self(), TASK_BASIC_INFO, (task_info_t)tinfo, &task_info_count);
//  if (kr != KERN_SUCCESS) {
//    callback(@[@(eventId)]);
//  }
//
//  task_basic_info_t      basic_info;
//  thread_array_t         thread_list;
//  mach_msg_type_number_t thread_count;
//
//  thread_info_data_t     thinfo;
//  mach_msg_type_number_t thread_info_count;
//
//  thread_basic_info_t basic_info_th;
//  uint32_t stat_thread = 0; // Mach threads
//
//  basic_info = (task_basic_info_t)tinfo;
//
//  // get threads in the task
//  kr = task_threads(mach_task_self(), &thread_list, &thread_count);
//  if (kr != KERN_SUCCESS) {
//    callback(@[@(eventId)]);
//  }
//  if (thread_count > 0)
//      stat_thread += thread_count;
//
//  long tot_sec = 0;
//  long tot_usec = 0;
//  float tot_cpu = 0;
//  int j;
//
//  for (j = 0; j < (int)thread_count; j++)
//  {
//      thread_info_count = THREAD_INFO_MAX;
//      kr = thread_info(thread_list[j], THREAD_BASIC_INFO,
//                       (thread_info_t)thinfo, &thread_info_count);
//      if (kr != KERN_SUCCESS) {
//        callback(@[@(eventId)]);
//      }
//
//      basic_info_th = (thread_basic_info_t)thinfo;
//
//      if (!(basic_info_th->flags & TH_FLAGS_IDLE)) {
//          tot_sec = tot_sec + basic_info_th->user_time.seconds + basic_info_th->system_time.seconds;
//          tot_usec = tot_usec + basic_info_th->user_time.microseconds + basic_info_th->system_time.microseconds;
//          tot_cpu = tot_cpu + basic_info_th->cpu_usage / (float)TH_USAGE_SCALE * 100.0;
//      }
//
//  } // for each thread
//
//  kr = vm_deallocate(mach_task_self(), (vm_offset_t)thread_list, thread_count * sizeof(thread_t));
//  assert(kr == KERN_SUCCESS);
//
//  callback(@[@(kr)]);
  
  
  
  processor_info_array_t _cpuInfo, _prevCPUInfo = nil;
  mach_msg_type_number_t _numCPUInfo, _numPrevCPUInfo = 0;
  unsigned _numCPUs;
  NSLock *_cpuUsageLock;
  
  Float32 totalUsage;

  int _mib[2U] = { CTL_HW, HW_NCPU };
  size_t _sizeOfNumCPUs = sizeof(_numCPUs);
  int _status = sysctl(_mib, 2U, &_numCPUs, &_sizeOfNumCPUs, NULL, 0U);
  if(_status)
      _numCPUs = 1;

  _cpuUsageLock = [[NSLock alloc] init];

  natural_t _numCPUsU = 0U;
  kern_return_t err = host_processor_info(mach_host_self(), PROCESSOR_CPU_LOAD_INFO, &_numCPUsU, &_cpuInfo, &_numCPUInfo);
  if(err == KERN_SUCCESS) {
      [_cpuUsageLock lock];

      for(unsigned i = 0U; i < _numCPUs; ++i) {
          Float32 _inUse, _total, coreUsage;
          if(_prevCPUInfo) {
              _inUse = (
                       (_cpuInfo[(CPU_STATE_MAX * i) + CPU_STATE_USER]   - _prevCPUInfo[(CPU_STATE_MAX * i) + CPU_STATE_USER])
                       + (_cpuInfo[(CPU_STATE_MAX * i) + CPU_STATE_SYSTEM] - _prevCPUInfo[(CPU_STATE_MAX * i) + CPU_STATE_SYSTEM])
                       + (_cpuInfo[(CPU_STATE_MAX * i) + CPU_STATE_NICE]   - _prevCPUInfo[(CPU_STATE_MAX * i) + CPU_STATE_NICE])
                       );
              _total = _inUse + (_cpuInfo[(CPU_STATE_MAX * i) + CPU_STATE_IDLE] - _prevCPUInfo[(CPU_STATE_MAX * i) + CPU_STATE_IDLE]);
          } else {
              _inUse = _cpuInfo[(CPU_STATE_MAX * i) + CPU_STATE_USER] + _cpuInfo[(CPU_STATE_MAX * i) + CPU_STATE_SYSTEM] + _cpuInfo[(CPU_STATE_MAX * i) + CPU_STATE_NICE];
              _total = _inUse + _cpuInfo[(CPU_STATE_MAX * i) + CPU_STATE_IDLE];
          }
        
          coreUsage = _inUse / _total * 100.f;
        
          totalUsage = coreUsage + totalUsage;
        
          NSLog(@"Core : %u, Usage: %.2f%%", i, coreUsage);
      }

      [_cpuUsageLock unlock];

      if(_prevCPUInfo) {
          size_t prevCpuInfoSize = sizeof(integer_t) * _numPrevCPUInfo;
          vm_deallocate(mach_task_self(), (vm_address_t)_prevCPUInfo, prevCpuInfoSize);
      }

      _prevCPUInfo = _cpuInfo;
      _numPrevCPUInfo = _numCPUInfo;

      _cpuInfo = nil;
      _numCPUInfo = 0U;
    
      callback(@[@(totalUsage/_numCPUs)]);
  } else {
      NSLog(@"Error!");
  }
}

@end
