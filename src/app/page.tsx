'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Profession } from './types/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Code2, Stethoscope, GraduationCap, Briefcase, X, User, Plus, Palette, ScaleIcon, Github, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [selectedIdentities, setSelectedIdentities] = useState<Profession[]>([]);
  const [customIdentities, setCustomIdentities] = useState<Profession[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [coffeeDialogOpen, setCoffeeDialogOpen] = useState(false);
  const [newIdentity, setNewIdentity] = useState({
    label: '',
    description: '',
  });
  const [error, setError] = useState('');

  // 检查是否有保存的学习状态
  useEffect(() => {
    const savedState = localStorage.getItem("wordLearningState");
    if (savedState) {
      const state = JSON.parse(savedState);
      if (state.selectedIdentities?.length > 0) {
        // 如果有保存的状态，直接跳转到 words 页面
        router.push("/words");
      }
    }
  }, [router]);

  const predefinedIdentities: Profession[] = [
    {
      id: 'programmer',
      label: '程序员',
      icon: Code2,
      description: '程序员日常工作中常用的英语表达',
    },
    {
      id: 'designer',
      label: '设计师',
      icon: Palette,
      description: '设计师工作交流中的常用英语',
    },
    {
      id: 'businessman',
      label: '商人',
      icon: Briefcase,
      description: '商务人士日常沟通中的英语用语',
    },
    {
      id: 'doctor',
      label: '医生',
      icon: Stethoscope,
      description: '医疗工作者的日常交流',
    },
    {
      id: 'teacher',
      label: '教师',
      icon: GraduationCap,
      description: '教师教学和日常工作中的表达',
    },
    {
      id: 'lawyer',
      label: '律师',
      icon: ScaleIcon,
      description: '律师职业日常使用的英语',
    },
  ];

  const allIdentities = [...predefinedIdentities, ...customIdentities];

  const handleIdentitySelect = (identity: Profession) => {
    setSelectedIdentities((prev) => {
      const isSelected = prev.some((i) => i.id === identity.id);

      if (isSelected) {
        return prev.filter((i) => i.id !== identity.id);
      }

      if (prev.length >= 3) {
        return prev;
      }

      return [...prev, identity];
    });
  };

  const handleCustomIdentityAdd = () => {
    if (!newIdentity.label.trim()) {
      setError('请输入身份名称');
      return;
    }

    // 检查是否已存在相同名称的身份
    if (allIdentities.some((identity) => identity.label === newIdentity.label.trim())) {
      setError('该身份名称已存在');
      return;
    }

    const customIdentity: Profession = {
      id: `custom-${Date.now()}`,
      label: newIdentity.label.trim(),
      icon: User,
      description: newIdentity.description.trim() || '自定义身份',
      isCustom: true,
    };

    setCustomIdentities((prev) => [...prev, customIdentity]);
    setNewIdentity({ label: '', description: '' });
    setError('');
    setDialogOpen(false);
  };

  const handleRemoveCustomIdentity = (identityId: string) => {
    setSelectedIdentities((prev) => prev.filter((i) => i.id !== identityId));
    setCustomIdentities((prev) => prev.filter((i) => i.id !== identityId));
  };

  const handleRemoveSelection = (identityId: string) => {
    setSelectedIdentities((prev) => prev.filter((i) => i.id !== identityId));
  };

  const handleStart = () => {
    localStorage.setItem('selectedIdentities', JSON.stringify(selectedIdentities));
    router.push('/words');
  };

  // 添加职业色彩映射
  const professionColors: Record<string, {bg: string, hover: string, icon: string}> = {
    programmer: {bg: 'bg-blue-50', hover: 'hover:bg-blue-100', icon: 'bg-blue-400'},
    designer: {bg: 'bg-purple-50', hover: 'hover:bg-purple-100', icon: 'bg-purple-400'},
    businessman: {bg: 'bg-amber-50', hover: 'hover:bg-amber-100', icon: 'bg-amber-400'},
    doctor: {bg: 'bg-green-50', hover: 'hover:bg-green-100', icon: 'bg-green-400'},
    teacher: {bg: 'bg-red-50', hover: 'hover:bg-red-100', icon: 'bg-red-400'},
    lawyer: {bg: 'bg-indigo-50', hover: 'hover:bg-indigo-100', icon: 'bg-indigo-400'},
    default: {bg: 'bg-gray-50', hover: 'hover:bg-gray-100', icon: 'bg-gray-400'}
  };
  
  // 获取职业颜色
  const getProfessionColor = (id: string) => {
    return professionColors[id] || professionColors.default;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* 更紧凑的顶部区域 */}
      <div className="relative overflow-hidden bg-primary/5 py-10">
        <div className="container relative z-10 mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="mb-3 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-4xl font-extrabold leading-none text-transparent sm:text-5xl whitespace-nowrap">
              AI-Driven Vocabulary by Identity
            </h1>
            <p className="mx-auto mb-6 max-w-2xl text-base text-muted-foreground">
              基于 AI 技术，根据你的职业背景生成贴合实际工作场景的英语例句，让记忆单词更有效、更有意义
            </p>
          </motion.div>
        </div>
        
        {/* 装饰元素 */}
        <div className="absolute -right-20 top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl"></div>
        <div className="absolute -left-20 top-40 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Selected Identities - 更紧凑设计 */}
        <div className="mb-6 rounded-lg bg-background p-3 shadow-sm">
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">已选择职业 ({selectedIdentities.length}/3):</h3>
          <div className="flex flex-wrap gap-2">
            {selectedIdentities.length === 0 ? (
              <p className="text-sm text-muted-foreground/70">请选择至少一个职业以开始学习</p>
            ) : (
              selectedIdentities.map((identity) => (
                <Badge 
                  key={identity.id} 
                  variant="secondary" 
                  className="animate-fadeIn gap-1 px-3 py-1 text-sm font-medium transition-all duration-300 hover:bg-secondary/80"
                >
                  {identity.label}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSelection(identity.id);
                    }}
                  />
                </Badge>
              ))
            )}
          </div>
        </div>

        {/* Add Custom Identity Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="mb-4">
              <Plus className="mr-2 h-4 w-4" />
              添加自定义职业
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>添加自定义职业</DialogTitle>
              <DialogDescription>添加一个新的职业身份，我们将根据这个职业生成相关专业场景的例句，帮助你更有效地记忆单词。</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="identity-name">
                  职业名称 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="identity-name"
                  value={newIdentity.label}
                  onChange={(e) => {
                    setNewIdentity((prev) => ({ ...prev, label: e.target.value }));
                    setError('');
                  }}
                  placeholder="输入自定义职业名称"
                  className="col-span-3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="identity-description">职业描述（可选）</Label>
                <Textarea
                  id="identity-description"
                  value={newIdentity.description}
                  onChange={(e) => setNewIdentity((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="描述这个职业的特点或工作场景（选填）"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => {
                  setDialogOpen(false);
                  setNewIdentity({ label: '', description: '' });
                  setError('');
                }}
              >
                取消
              </Button>
              <Button onClick={handleCustomIdentityAdd}>添加</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 分割线和标题 - 更紧凑 */}
        <div className="mb-4 flex items-center gap-4">
        </div>

        {/* All Identities - 更多色彩卡片设计 */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allIdentities.map((identity, index) => {
            const Icon = identity.icon;
            const isSelected = selectedIdentities.some((i) => i.id === identity.id);
            const colorScheme = getProfessionColor(identity.id);

            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                key={identity.id}
              >
                <Card
                  className={`group relative cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg
                    ${isSelected ? 'border-primary border-2' : 'border border-transparent'} 
                    ${colorScheme.bg} ${colorScheme.hover}`}
                  onClick={() => handleIdentitySelect(identity)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleIdentitySelect(identity);
                    }
                  }}
                >
                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute right-0 top-0 h-8 w-8">
                      <div className="absolute right-0 top-0 h-0 w-0 border-t-[24px] border-r-[24px] border-t-primary border-r-primary"></div>
                      <div className="absolute right-1 top-1 text-white">
                        <svg width="10" height="8" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  {/* 自定义身份删除按钮 */}
                  {identity.isCustom && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCustomIdentity(identity.id);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <div className="p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <div className={`rounded-lg ${isSelected ? 'bg-primary text-white' : colorScheme.icon + ' text-white'} p-2 transition-colors duration-300`}>
                        {Icon && <Icon className="h-5 w-5" />}
                      </div>
                      <h2 className="text-lg font-semibold">{identity.label}</h2>
                    </div>
                    <p className="text-xs text-muted-foreground">{identity.description}</p>
                    
                    <div className={`mt-3 flex items-center text-xs font-medium ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                      <span>{isSelected ? '已选择' : '点击选择'}</span>
                      <ChevronRight className="ml-1 h-3 w-3" />
                    </div>
                  </div>
                  
                  {/* 底部装饰条已移除 */}
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* 自定义职业按钮 - 更紧凑 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-6 flex justify-center"
        >
          <Button 
            variant="outline" 
            className="group flex items-center gap-2"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
            添加自定义职业
          </Button>
        </motion.div>

        {/* Start Button - 更紧凑设计 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 flex justify-center"
        >
          <Button
            size="lg"
            className={`group relative h-12 overflow-hidden px-8 text-base shadow-lg transition-all duration-300
              ${selectedIdentities.length === 0 ? 'opacity-70' : 'hover:shadow-primary/25'}`}
            disabled={selectedIdentities.length === 0}
            onClick={handleStart}
          >
            <span className="relative z-10 flex items-center gap-2">
              开始学习
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="absolute inset-0 -translate-y-full bg-gradient-to-r from-primary to-blue-600 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"></span>
          </Button>
        </motion.div>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-12 flex justify-center gap-6 text-muted-foreground"
        >
          <a
            href="https://github.com/winterfx/prowords"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition-colors hover:opacity-80"
          >
            <Github className="h-6 w-6 text-[#333333] dark:text-white" />
          </a>
          <Dialog open={coffeeDialogOpen} onOpenChange={setCoffeeDialogOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 transition-colors hover:opacity-80">
                <Coffee className="h-6 w-6 text-[#C0742E]" />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Buy Me a Coffee</DialogTitle>
                <DialogDescription>
                  扫码支持一下，谢谢！
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-center p-4">
                <img src="/api/qrcode" alt="Buy Me a Coffee QR Code" className="max-h-64 w-auto" />
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </div>
  );
}
