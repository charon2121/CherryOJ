# 沙箱核心组件

## Sandbox

负责调度沙箱，管理运行流程

## SandboxCompiler

负责编译用户代码（如 gcc、g++、javac）

## SandboxExecutor

负责执行用户代码，监控运行情况

## SandboxCgroup

负责限制 CPU、内存、进程数

## SandboxSeccomp

负责过滤危险 syscall，防止恶意代码

## SandboxNamespace

负责创建进程隔离（unshare()）

## SandboxMonitor

负责监测运行时间、内存占用、异常状态

## SandboxNetwork

负责网络隔离，防止外部访问

## SandboxStorage

负责存储临时编译/运行文件

## SandboxLogger

负责日志记录，便于调试
