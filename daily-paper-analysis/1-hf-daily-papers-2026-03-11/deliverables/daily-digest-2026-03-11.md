---
title: "HuggingFace Daily Papers Digest — March 11, 2026"
date: 2026-03-11
type: digest
tags: [daily-papers, 2026-03-11]
papers: 30
---

# HuggingFace Daily Papers Digest — March 11, 2026

- Total papers: **30**
- Generated: **March 12, 2026 at 03:56:55 UTC**

## Language Models & NLP (6)

| Rank | Title | Upvotes |
|---|---|---:|
| 1 | [Thinking to Recall: How Reasoning Unlocks Parametric Knowledge in LLMs](https://arxiv.org/abs/2603.09906) | 44 |
| 2 | [The Reasoning Trap -- Logical Reasoning as a Mechanistic Pathway to Situational Awareness](https://arxiv.org/abs/2603.09200) | 3 |
| 3 | [Compiler-First State Space Duality and Portable O(1) Autoregressive Caching for Inference](https://arxiv.org/abs/2603.09555) | 1 |
| 4 | [ConFu: Contemplate the Future for Better Speculative Sampling](https://arxiv.org/abs/2603.08899) | 1 |
| 5 | [Multi-Head Low-Rank Attention](https://arxiv.org/abs/2603.02188) | 1 |
| 6 | [SAHOO: Safeguarded Alignment for High-Order Optimization Objectives in Recursive Self-Improvement](https://arxiv.org/abs/2603.06333) | 1 |

### 1. [Thinking to Recall: How Reasoning Unlocks Parametric Knowledge in LLMs](https://arxiv.org/abs/2603.09906)

- Authors: Zorik Gekhman, Roee Aharoni, Eran Ofek, et al.
- Upvotes: **44**
- Keywords: large language models, parametric knowledge recall, reasoning, computational buffer effect, factual priming, generative self-retrieval, hallucination, reasoning trajectories
- Links: [arXiv](https://arxiv.org/abs/2603.09906) · [PDF](https://arxiv.org/pdf/2603.09906) · [HuggingFace](https://huggingface.co/papers/2603.09906)

> [!info] Summary
> Reasoning in large language models enhances parametric knowledge recall through computational buffer and factual priming mechanisms, though it carries risks of hallucination that can be mitigated by prioritizing accurate reasoning trajectories. While reasoning in LLMs plays a natural role in math, code generation, and multi-hop factual questions, its effect on simple, single-hop factual questions remains unclear. Such questions do not require step-by-step logical decomposition, making the utility of reasoning highly counterintuitive. Nevertheless, we find that enabling reasoning substantially expands the capability boundary of the model's parametric knowledge recall, unlocking correct answers that are otherwise effectively unreachable.

> [!success] Key Contribution
> **We demonstrate that hallucinating intermediate facts during reasoning increases the likelihood of hallucinations in the final answer.**

### 2. [The Reasoning Trap -- Logical Reasoning as a Mechanistic Pathway to Situational Awareness](https://arxiv.org/abs/2603.09200)

- Authors: Subramanyam Sahoo, Aman Chadha, Vinija Jain, et al.
- Upvotes: **3**
- Keywords: logical reasoning, large language models, situational awareness, deductive self inference, inductive context recognition, abductive self modeling, RAISE framework, strategic deception, Mirror Test, Reasoning Safety Parity Principle
- Links: [arXiv](https://arxiv.org/abs/2603.09200) · [PDF](https://arxiv.org/pdf/2603.09200) · [HuggingFace](https://huggingface.co/papers/2603.09200)

> [!info] Summary
> The RAISE framework demonstrates how advances in logical reasoning capabilities within large language models can lead to increasingly sophisticated forms of situational awareness, potentially resulting in strategic deception, and proposes safety measures to address this... Situational awareness, the capacity of an AI system to recognize its own nature, understand its training and deployment context, and reason strategically about its circumstances, is widely considered among the most dangerous emergent capabilities in... Separately, a growing research effort seeks to improve the logical reasoning capabilities of large language models (LLMs) across deduction, induction, and abduction. In this paper, we argue that these two research trajectories are on a collision course.

> [!success] Key Contribution
> **We introduce the RAISE framework (Reasoning Advancing Into Self Examination), which identifies three mechanistic pathways through which improvements in logical reasoning enable progressively deeper levels of situation...**

### 3. [Compiler-First State Space Duality and Portable O(1) Autoregressive Caching for Inference](https://arxiv.org/abs/2603.09555)

- Authors: Cosmo Santoni
- Upvotes: **1**
- Keywords: state-space model, fused CUDA kernels, Triton kernels, XLA, Mamba-2, state space duality algorithm, diagonal state structure, chunkable recurrence, einsum-dominated compute, static control flow, compiled on-device cache, MFU, bandwidth utilisation, greedy decoding, float32 rounding tolerance, SSM recurrence, XLA backend
- Links: [arXiv](https://arxiv.org/abs/2603.09555) · [PDF](https://arxiv.org/pdf/2603.09555) · [HuggingFace](https://huggingface.co/papers/2603.09555) · [GitHub](https://github.com/CosmoNaught/mamba2-jax)

> [!info] Summary
> Mamba-2's state space model is implemented using XLA-optimized primitives without custom CUDA or Triton kernels, enabling cross-platform deployment and achieving high performance on TPU. State-space model releases are typically coupled to fused CUDA and Triton kernels, inheriting a hard dependency on NVIDIA hardware. We show that Mamba-2's state space duality algorithm -- diagonal state structure, chunkable recurrence, and einsum-dominated compute with static control flow -- maps cleanly onto what XLA's fusion and tiling passes actually optimise, making custom... We implement the full inference path (prefill, cached autoregressive decoding) as shaped standard primitives under XLA, without hand-written kernels, and realise the architecture's theoretical O(1) state management as a compiled on-device cache requiring no host...

> [!success] Key Contribution
> **We show that Mamba-2's state space duality algorithm -- diagonal state structure, chunkable recurrence, and einsum-dominated compute with static control flow -- maps cleanly onto what XLA's fusion and tiling passes ac...**

### 4. [ConFu: Contemplate the Future for Better Speculative Sampling](https://arxiv.org/abs/2603.08899)

- Authors: Zongyue Qin, Raghavv Goel, Mukul Gagrani, et al.
- Upvotes: **1**
- Keywords: speculative decoding, draft models, large language models, EAGLE series, token acceptance rate, continuous reasoning tokens, contemplate tokens, soft prompts, MoE, anchor token sampling, future prediction replication
- Links: [arXiv](https://arxiv.org/abs/2603.08899) · [PDF](https://arxiv.org/pdf/2603.08899) · [HuggingFace](https://huggingface.co/papers/2603.08899)

> [!info] Summary
> ConFu is a novel speculative decoding framework that enhances draft model performance by enabling future-oriented generation prediction through contemplate tokens and soft prompts, achieving improved token acceptance rates and faster inference speeds. Speculative decoding has emerged as a powerful approach to accelerate large language model (LLM) inference by employing lightweight draft models to propose candidate tokens that are subsequently verified by the target model. The effectiveness of this paradigm critically depends on the quality of the draft model. While recent advances such as the EAGLE series achieve state-of-the-art speedup, existing draft models remain limited by error accumulation: they condition only on the current prefix, causing their predictions to drift from the target model...

> [!success] Key Contribution
> **We propose ConFu (Contemplate the Future), a novel speculative decoding framework that enables draft models to anticipate the future direction of generation.**

### 5. [Multi-Head Low-Rank Attention](https://arxiv.org/abs/2603.02188)

- Authors: Songtao Liu, Hongwu Peng, Zhiwei Zhang, et al.
- Upvotes: **1**
- Keywords: Key--Value cache, decoding stage, High-Bandwidth Memory, Static Random-Access Memory, Multi-Head Latent Attention, Tensor Parallelism, latent states, Multi-Head Low-Rank Attention, perplexity, downstream task performance
- Links: [arXiv](https://arxiv.org/abs/2603.02188) · [PDF](https://arxiv.org/pdf/2603.02188) · [HuggingFace](https://huggingface.co/papers/2603.02188) · [GitHub](https://github.com/SongtaoLiu0823/MLRA)

> [!info] Summary
> Multi-Head Low-Rank Attention addresses long-context inference bottlenecks in large language models by enabling efficient 4-way tensor parallelism decoding through partitionable latent states. Long-context inference in large language models is bottlenecked by Key--Value (KV) cache loading during the decoding stage, where the sequential nature of generation requires repeatedly transferring the KV cache from off-chip High-Bandwidth Memory (HBM) to... While Multi-Head Latent Attention (MLA) significantly reduces the total KV cache size, it suffers from a sharding bottleneck during distributed decoding via Tensor Parallelism (TP). Since its single latent head cannot be partitioned, each device is forced to redundantly load the complete KV cache for every token, consuming excessive memory traffic and diminishing TP benefits like weight sharding.

> [!success] Key Contribution
> **We propose Multi-Head Low-Rank Attention (MLRA), which enables partitionable latent states for efficient 4-way TP decoding.**

### 6. [SAHOO: Safeguarded Alignment for High-Order Optimization Objectives in Recursive Self-Improvement](https://arxiv.org/abs/2603.06333)

- Authors: Subramanyam Sahoo, Aman Chadha, Vinija Jain, et al.
- Upvotes: **1**
- Keywords: recursive self-improvement, alignment drift, Goal Drift Index, multi-signal detector, constraint preservation, regression-risk quantification, code generation, mathematical reasoning, truthfulness, capability-alignment frontier
- Links: [arXiv](https://arxiv.org/abs/2603.06333) · [PDF](https://arxiv.org/pdf/2603.06333) · [HuggingFace](https://huggingface.co/papers/2603.06333)

> [!info] Summary
> SAHOO provides a framework for monitoring and controlling alignment drift in self-improving AI systems through goal drift detection, constraint preservation, and regression risk quantification across multiple domains. Recursive self-improvement is moving from theory to practice: modern systems can critique, revise, and evaluate their own outputs, yet iterative self-modification risks subtle alignment drift. We introduce SAHOO, a practical framework to monitor and control drift through three safeguards: (i) the Goal Drift Index (GDI), a learned multi-signal detector combining semantic, lexical, structural, and distributional measures; (ii) constraint preservation checks... Across 189 tasks in code generation, mathematical reasoning, and truthfulness, SAHOO produces substantial quality gains, including 18.3 percent improvement in code tasks and 16.8 percent in reasoning, while preserving constraints in two domains and maintaining...

> [!success] Key Contribution
> **We introduce SAHOO, a practical framework to monitor and control drift through three safeguards: (i) the Goal Drift Index (GDI), a learned multi-signal detector combining semantic, lexical, structural, and distributio...**

## Computer Vision & Multimodal (7)

| Rank | Title | Upvotes |
|---|---|---:|
| 7 | [InternVL-U: Democratizing Unified Multimodal Models for Understanding, Reasoning, Generation and Editing](https://arxiv.org/abs/2603.09877) | 28 |
| 8 | [Reading, Not Thinking: Understanding and Bridging the Modality Gap When Text Becomes Pixels in Multimodal LLMs](https://arxiv.org/abs/2603.09095) | 21 |
| 9 | [Stepping VLMs onto the Court: Benchmarking Spatial Intelligence in Sports](https://arxiv.org/abs/2603.09896) | 21 |
| 10 | [VLM-SubtleBench: How Far Are VLMs from Human-Level Subtle Comparative Reasoning?](https://arxiv.org/abs/2603.07888) | 9 |
| 11 | [Streaming Autoregressive Video Generation via Diagonal Distillation](https://arxiv.org/abs/2603.09488) | 5 |
| 12 | [BiCLIP: Domain Canonicalization via Structured Geometric Transformation](https://arxiv.org/abs/2603.08942) | 1 |
| 13 | [Micro-Diffusion Compression -- Binary Tree Tweedie Denoising for Online Probability Estimation](https://arxiv.org/abs/2603.08771) | 0 |

### 7. [InternVL-U: Democratizing Unified Multimodal Models for Understanding, Reasoning, Generation and Editing](https://arxiv.org/abs/2603.09877)

- Authors: Changyao Tian, Danni Yang, Guanzhou Chen, et al.
- Upvotes: **28**
- Keywords: Unified multimodal models, Multimodal Large Language Model, MMDiT-based visual generation head, Chain-of-Thought, visual representations, modality-specific modular design, unified contextual modeling, text rendering, scientific reasoning, high-semantic-density tasks
- Links: [arXiv](https://arxiv.org/abs/2603.09877) · [PDF](https://arxiv.org/pdf/2603.09877) · [HuggingFace](https://huggingface.co/papers/2603.09877) · [GitHub](https://github.com/OpenGVLab/InternVL-U)

> [!info] Summary
> InternVL-U is a 4-billion parameter unified multimodal model that combines advanced visual generation with robust semantic understanding through specialized modular design and reasoning-centric data synthesis. Unified multimodal models (UMMs) that integrate understanding, reasoning, generation, and editing face inherent trade-offs between maintaining strong semantic comprehension and acquiring powerful generation capabilities. In this report, we present InternVL-U, a lightweight 4B-parameter UMM that democratizes these capabilities within a unified framework. Guided by the principles of unified contextual modeling and modality-specific modular design with decoupled visual representations, InternVL-U integrates a state-of-the-art Multimodal Large Language Model (MLLM) with a specialized MMDiT-based visual generation head.

> [!success] Key Contribution
> **We present InternVL-U, a lightweight 4B-parameter UMM that democratizes these capabilities within a unified framework.**

### 8. [Reading, Not Thinking: Understanding and Bridging the Modality Gap When Text Becomes Pixels in Multimodal LLMs](https://arxiv.org/abs/2603.09095)

- Authors: Kaiser Sun, Xiaochuang Yuan, Hongjun Liu, et al.
- Upvotes: **21**
- Keywords: multimodal large language models, modality gap, visual text understanding, self-distillation, reasoning traces, GSM8K
- Links: [arXiv](https://arxiv.org/abs/2603.09095) · [PDF](https://arxiv.org/pdf/2603.09095) · [HuggingFace](https://huggingface.co/papers/2603.09095)

> [!info] Summary
> Multimodal large language models exhibit inconsistent performance when processing text from images versus textual tokens, with factors like rendering quality and task type influencing this modality gap, which can be mitigated through self-distillation techniques that... Multimodal large language models (MLLMs) can process text presented as images, yet they often perform worse than when the same content is provided as textual tokens. We systematically diagnose this "modality gap" by evaluating seven MLLMs across seven benchmarks in five input modes, spanning both synthetically rendered text and realistic document images from arXiv PDFs to Wikipedia pages. We find that the modality gap is task- and data-dependent.

> [!success] Key Contribution
> **We propose a self-distillation method that trains the model on its own pure text reasoning traces paired with image inputs, raising image-mode accuracy on GSM8K from 30.**

### 9. [Stepping VLMs onto the Court: Benchmarking Spatial Intelligence in Sports](https://arxiv.org/abs/2603.09896)

- Authors: Yuchen Yang, Yuqing Shao, Duxiu Huang, et al.
- Upvotes: **21**
- Keywords: spatial intelligence, vision-language models, CourtSI, CourtSI-Bench, CourtSI-Ext, Qwen3-VL-8B, fine-tuning, spatial-aware commentary generation
- Links: [arXiv](https://arxiv.org/abs/2603.09896) · [PDF](https://arxiv.org/pdf/2603.09896) · [HuggingFace](https://huggingface.co/papers/2603.09896) · [GitHub](https://github.com/Visionary-Laboratory/CourtSI)

> [!info] Summary
> CourtSI is a large-scale spatial intelligence dataset for sports scenarios that enables evaluation and improvement of vision-language models' understanding of human motion and object interactions. Sports have long attracted broad attention as they push the limits of human physical and cognitive capabilities. Amid growing interest in spatial intelligence for vision-language models (VLMs), sports provide a natural testbed for understanding high-intensity human motion and dynamic object interactions. To this end, we present CourtSI, the first large-scale spatial intelligence dataset tailored to sports scenarios.

> [!success] Key Contribution
> **We present CourtSI, the first large-scale spatial intelligence dataset tailored to sports scenarios.**

### 10. [VLM-SubtleBench: How Far Are VLMs from Human-Level Subtle Comparative Reasoning?](https://arxiv.org/abs/2603.07888)

- Authors: Minkyu Kim, Sangheon Lee, Dongmin Park
- Upvotes: **9**
- Keywords: vision-language models, comparative reasoning, benchmark, visual similarity, nuanced reasoning, paired question-image sets
- Links: [arXiv](https://arxiv.org/abs/2603.07888) · [PDF](https://arxiv.org/pdf/2603.07888) · [HuggingFace](https://huggingface.co/papers/2603.07888) · [GitHub](https://github.com/krafton-ai/VLM-SubtleBench)

> [!info] Summary
> VLM-SubtleBench is introduced as a benchmark for evaluating vision-language models on subtle comparative reasoning across diverse domains, revealing significant gaps between model and human performance. The ability to distinguish subtle differences between visually similar images is essential for diverse domains such as industrial anomaly detection, medical imaging, and aerial surveillance. While comparative reasoning benchmarks for vision-language models (VLMs) have recently emerged, they primarily focus on images with large, salient differences and fail to capture the nuanced reasoning required for real-world applications. In this work, we introduce VLM-SubtleBench, a benchmark designed to evaluate VLMs on subtle comparative reasoning.

> [!success] Key Contribution
> **We introduce VLM-SubtleBench, a benchmark designed to evaluate VLMs on subtle comparative reasoning.**

### 11. [Streaming Autoregressive Video Generation via Diagonal Distillation](https://arxiv.org/abs/2603.09488)

- Authors: Jinxiu Liu, Xuanming Liu, Kangfu Mei, et al.
- Upvotes: **5**
- Keywords: diffusion models, video distillation, autoregressive models, denoising autoencoders, temporal context, diagonal distillation, asymmetric generation strategy, implicit prediction, error propagation, optical flow modeling, motion coherence
- Links: [arXiv](https://arxiv.org/abs/2603.09488) · [PDF](https://arxiv.org/pdf/2603.09488) · [HuggingFace](https://huggingface.co/papers/2603.09488) · [GitHub](https://github.com/Sphere-AI-Lab/diagdistill)

> [!info] Summary
> Diagonal Distillation improves video generation speed and quality by leveraging temporal context and asymmetric denoising steps while addressing error accumulation and motion coherence issues in diffusion model distillation. Large pretrained diffusion models have significantly enhanced the quality of generated videos, and yet their use in real-time streaming remains limited. Autoregressive models offer a natural framework for sequential frame synthesis but require heavy computation to achieve high fidelity. Diffusion distillation can compress these models into efficient few-step variants, but existing video distillation approaches largely adapt image-specific methods that neglect temporal dependencies.

> [!success] Key Contribution
> **We propose Diagonal Distillation, which operates orthogonally to existing approaches and better exploits temporal information across both video chunks and denoising steps.**

### 12. [BiCLIP: Domain Canonicalization via Structured Geometric Transformation](https://arxiv.org/abs/2603.08942)

- Authors: Pranav Mantini, Shishir K. Shah
- Upvotes: **1**
- Keywords: vision-language models, canonical transformation, geometric transformation, cross-modal alignment, bilinear transformation, domain adaptation, few-shot classification, multimodal features, canonicalized geometric transformation, structured alignment
- Links: [arXiv](https://arxiv.org/abs/2603.08942) · [PDF](https://arxiv.org/pdf/2603.08942) · [HuggingFace](https://huggingface.co/papers/2603.08942) · [GitHub](https://github.com/QuantitativeImagingLaboratory/BilinearCLIP)

> [!info] Summary
> Vision-language models can be adapted to specialized domains through a simple bilinear transformation that aligns multimodal features via geometric canonicalization, achieving state-of-the-art results on multiple benchmarks. Recent advances in vision-language models (VLMs) have demonstrated remarkable zero-shot capabilities, yet adapting these models to specialized domains remains a significant challenge. Building on recent theoretical insights suggesting that independently trained VLMs are related by a canonical transformation, we extend this understanding to the concept of domains. We hypothesize that image features across disparate domains are related by a canonicalized geometric transformation that can be recovered using a small set of anchors.

> [!success] Key Contribution
> **We introduce BiCLIP, a framework that applies a targeted transformation to multimodal features to enhance cross-modal alignment.**

### 13. [Micro-Diffusion Compression -- Binary Tree Tweedie Denoising for Online Probability Estimation](https://arxiv.org/abs/2603.08771)

- Authors: Roberto Tacconelli
- Upvotes: **0**
- Keywords: lossless compression, micro-diffusion denoising layer, adaptive statistical models, probability estimates, Prediction by Partial Matching, shrinkage process, empirical calibration statistics, bitwise tree, binary calibration tasks, residual prediction errors, post-blend calibration, trie-based word model, high-order context model
- Links: [arXiv](https://arxiv.org/abs/2603.08771) · [PDF](https://arxiv.org/pdf/2603.08771) · [HuggingFace](https://huggingface.co/papers/2603.08771) · [GitHub](https://github.com/robtacconelli/midicoth)

> [!info] Summary
> Midicoth enhances compression efficiency by applying a micro-diffusion denoising layer to refine probability estimates in adaptive statistical models, addressing limitations in sparse data scenarios through hierarchical binary decision making and iterative error correction. We present Midicoth, a lossless compression system that introduces a micro-diffusion denoising layer for improving probability estimates produced by adaptive statistical models. In compressors such as Prediction by Partial Matching (PPM), probability estimates are smoothed by a prior to handle sparse observations. When contexts have been seen only a few times, this prior dominates the prediction and produces distributions that are significantly flatter than the true source distribution, leading to compression inefficiency.

> [!success] Key Contribution
> **We present Midicoth, a lossless compression system that introduces a micro-diffusion denoising layer for improving probability estimates produced by adaptive statistical models.**

## Reinforcement Learning & Agents (10)

| Rank | Title | Upvotes |
|---|---|---:|
| 14 | [Geometry-Guided Reinforcement Learning for Multi-view Consistent 3D Scene Editing](https://arxiv.org/abs/2603.03143) | 122 |
| 15 | [MM-Zero: Self-Evolving Multi-Model Vision Language Models From Zero Data](https://arxiv.org/abs/2603.09206) | 36 |
| 16 | [MiniAppBench: Evaluating the Shift from Text to Interactive HTML Responses in LLM-Powered Assistants](https://arxiv.org/abs/2603.09652) | 8 |
| 17 | [Test-Driven AI Agent Definition (TDAD): Compiling Tool-Using Agents from Behavioral Specifications](https://arxiv.org/abs/2603.08806) | 5 |
| 18 | [Decoupling Reasoning and Confidence: Resurrecting Calibration in Reinforcement Learning from Verifiable Rewards](https://arxiv.org/abs/2603.09117) | 3 |
| 19 | [BrandFusion: A Multi-Agent Framework for Seamless Brand Integration in Text-to-Video Generation](https://arxiv.org/abs/2603.02816) | 2 |
| 20 | [ReflexiCoder: Teaching Large Language Models to Self-Reflect on Generated Code and Self-Correct It via Reinforcement Learning](https://arxiv.org/abs/2603.05863) | 2 |
| 21 | [Reward Prediction with Factorized World States](https://arxiv.org/abs/2603.09400) | 2 |
| 22 | [Towards a Neural Debugger for Python](https://arxiv.org/abs/2603.09951) | 2 |
| 23 | [Beyond Test-Time Training: Learning to Reason via Hardware-Efficient Optimal Control](https://arxiv.org/abs/2603.09221) | 0 |

### 14. [Geometry-Guided Reinforcement Learning for Multi-view Consistent 3D Scene Editing](https://arxiv.org/abs/2603.03143)

- Authors: Jiyuan Wang, Chunyu Lin, Lei Sun, et al.
- Upvotes: **122**
- Keywords: diffusion models, reinforcement learning, 3D editing, multi-view consistency, supervised fine-tuning, VGGT, reward signals, 3D foundation model
- Links: [arXiv](https://arxiv.org/abs/2603.03143) · [PDF](https://arxiv.org/pdf/2603.03143) · [HuggingFace](https://huggingface.co/papers/2603.03143) · [GitHub](https://github.com/AMAP-ML/RL3DEdit)

> [!info] Summary
> RL3DEdit uses reinforcement learning with rewards from a 3D foundation model to achieve multi-view consistent 3D editing from 2D editing priors. Leveraging the priors of 2D diffusion models for 3D editing has emerged as a promising paradigm. However, maintaining multi-view consistency in edited results remains challenging, and the extreme scarcity of 3D-consistent editing paired data renders supervised fine-tuning (SFT), the most effective training strategy for editing tasks, infeasible. In this paper, we observe that, while generating multi-view consistent 3D content is highly challenging, verifying 3D consistency is tractable, naturally positioning reinforcement learning (RL) as a feasible solution.

> [!success] Key Contribution
> **We propose RL3DEdit, a single-pass framework driven by RL optimization with novel rewards derived from the 3D foundation model, VGGT.**

### 15. [MM-Zero: Self-Evolving Multi-Model Vision Language Models From Zero Data](https://arxiv.org/abs/2603.09206)

- Authors: Zongxia Li, Hongyang Du, Chengsong Huang, et al.
- Upvotes: **36**
- Keywords: self-evolving, Large Language Models, Vision Language Models, reinforcement learning, multimodal reasoning, Group Relative Policy Optimization, visual concepts, executable code, visual verification, difficulty balancing
- Links: [arXiv](https://arxiv.org/abs/2603.09206) · [PDF](https://arxiv.org/pdf/2603.09206) · [HuggingFace](https://huggingface.co/papers/2603.09206) · [GitHub](https://github.com/zli12321/MM-Zero)

> [!info] Summary
> MM-Zero enables zero-data self-evolution of vision-language models through a multi-role framework with proposer, coder, and solver components trained via group relative policy optimization. Self-evolving has emerged as a key paradigm for improving foundational models such as Large Language Models (LLMs) and Vision Language Models (VLMs) with minimal human intervention. While recent approaches have demonstrated that LLM agents can self-evolve from scratch with little to no data, VLMs introduce an additional visual modality that typically requires at least some seed data, such as images, to... In this work, we present Multi-model Multimodal Zero (MM-Zero), the first RL-based framework to achieve zero-data self-evolution for VLM reasoning.

> [!success] Key Contribution
> **We present Multi-model Multimodal Zero (MM-Zero), the first RL-based framework to achieve zero-data self-evolution for VLM reasoning.**

### 16. [MiniAppBench: Evaluating the Shift from Text to Interactive HTML Responses in LLM-Powered Assistants](https://arxiv.org/abs/2603.09652)

- Authors: Zuhao Zhang, Chengyue Yu, Yuante Li, et al.
- Upvotes: **8**
- Keywords: Large Language Models, MiniApps, interactive application generation, benchmark, agentic evaluation framework, browser automation, human-like exploratory testing
- Links: [arXiv](https://arxiv.org/abs/2603.09652) · [PDF](https://arxiv.org/pdf/2603.09652) · [HuggingFace](https://huggingface.co/papers/2603.09652) · [GitHub](https://github.com/MiniAppBench/miniappbench)

> [!info] Summary
> MiniAppBench introduces the first comprehensive benchmark for evaluating principle-driven, interactive application generation, addressing the gap in existing benchmarks that focus on static correctness rather than dynamic, real-world interactions. With the rapid advancement of Large Language Models (LLMs) in code generation, human-AI interaction is evolving from static text responses to dynamic, interactive HTML-based applications, which we term MiniApps. These applications require models to not only render visual interfaces but also construct customized interaction logic that adheres to real-world principles. However, existing benchmarks primarily focus on algorithmic correctness or static layout reconstruction, failing to capture the capabilities required for this new paradigm.

> [!success] Key Contribution
> **We introduce MiniAppBench, the first comprehensive benchmark designed to evaluate principle-driven, interactive application generation.**

### 17. [Test-Driven AI Agent Definition (TDAD): Compiling Tool-Using Agents from Behavioral Specifications](https://arxiv.org/abs/2603.08806)

- Authors: Tzafrir Rehan
- Upvotes: **5**
- Keywords: agent prompts, behavioral specifications, coding agent, prompt refinement, tool-using LLM agents, specification gaming, test-driven development, semantic mutation testing, spec evolution scenarios, SpecSuite-Core
- Links: [arXiv](https://arxiv.org/abs/2603.08806) · [PDF](https://arxiv.org/pdf/2603.08806) · [HuggingFace](https://huggingface.co/papers/2603.08806) · [GitHub](https://github.com/f-labs-io/tdad-paper-code)

> [!info] Summary
> TDAD is a methodology for developing AI agents that uses behavioral specifications and automated testing to ensure reliable and compliant deployment of language model agents in production environments. We present Test-Driven AI Agent Definition (TDAD), a methodology that treats agent prompts as compiled artifacts: engineers provide behavioral specifications, a coding agent converts them into executable tests, and a second coding agent iteratively refines... Deploying tool-using LLM agents in production requires measurable behavioral compliance that current development practices cannot provide. Small prompt changes cause silent regressions, tool misuse goes undetected, and policy violations emerge only after deployment.

> [!success] Key Contribution
> **We present Test-Driven AI Agent Definition (TDAD), a methodology that treats agent prompts as compiled artifacts: engineers provide behavioral specifications, a coding agent converts them into executable tests, and a...**

### 18. [Decoupling Reasoning and Confidence: Resurrecting Calibration in Reinforcement Learning from Verifiable Rewards](https://arxiv.org/abs/2603.09117)

- Authors: Zhengzhao Ma, Xueru Wen, Boxi Cao, et al.
- Upvotes: **3**
- Keywords: reinforcement learning from verifiable rewards, large language models, calibration degeneration, policy accuracy, calibration error, gradient conflict, direct comparison policy optimization, GRPO
- Links: [arXiv](https://arxiv.org/abs/2603.09117) · [PDF](https://arxiv.org/pdf/2603.09117) · [HuggingFace](https://huggingface.co/papers/2603.09117) · [GitHub](https://github.com/icip-cas/DCPO)

> [!info] Summary
> DCPO framework decouples reasoning and calibration objectives in LLMs to address calibration degeneration while maintaining high accuracy. Reinforcement Learning from Verifiable Rewards (RLVR) significantly enhances large language models (LLMs) reasoning but severely suffers from calibration degeneration, where models become excessively over-confident in incorrect answers. Previous studies devote to directly incorporating calibration objective into existing optimization target. However, our theoretical analysis demonstrates that there exists a fundamental gradient conflict between the optimization for maximizing policy accuracy and minimizing calibration error.

> [!success] Key Contribution
> **We propose DCPO, a simple yet effective framework that systematically decouples reasoning and calibration objectives.**

### 19. [BrandFusion: A Multi-Agent Framework for Seamless Brand Integration in Text-to-Video Generation](https://arxiv.org/abs/2603.02816)

- Authors: Zihao Zhu, Ruotong Wang, Siwei Lyu, et al.
- Upvotes: **2**
- Keywords: text-to-video models, brand integration, multi-agent framework, brand knowledge base, prompt refinement, semantic preservation, brand recognizability, contextual tracking, iterative refinement
- Links: [arXiv](https://arxiv.org/abs/2603.02816) · [PDF](https://arxiv.org/pdf/2603.02816) · [HuggingFace](https://huggingface.co/papers/2603.02816)

> [!info] Summary
> BrandFusion is a multi-agent framework that integrates advertiser brands into text-to-video generation while maintaining semantic fidelity and brand recognizability. The rapid advancement of text-to-video (T2V) models has revolutionized content creation, yet their commercial potential remains largely untapped. We introduce, for the first time, the task of seamless brand integration in T2V: automatically embedding advertiser brands into prompt-generated videos while preserving semantic fidelity to user intent. This task confronts three core challenges: maintaining prompt fidelity, ensuring brand recognizability, and achieving contextually natural integration.

> [!success] Key Contribution
> **We introduce, for the first time, the task of seamless brand integration in T2V: automatically embedding advertiser brands into prompt-generated videos while preserving semantic fidelity to user intent.**

### 20. [ReflexiCoder: Teaching Large Language Models to Self-Reflect on Generated Code and Self-Correct It via Reinforcement Learning](https://arxiv.org/abs/2603.05863)

- Authors: Juyong Jiang, Jiasi Shen, Sunghun Kim, et al.
- Upvotes: **2**
- Keywords: Large Language Models, reinforcement learning, code generation, iterative refinement, external oracles, prompt-response cycles, RL-zero training, granular reward functions, self-reflection, self-correction, inference time, token efficiency, computational overhead
- Links: [arXiv](https://arxiv.org/abs/2603.05863) · [PDF](https://arxiv.org/pdf/2603.05863) · [HuggingFace](https://huggingface.co/papers/2603.05863) · [GitHub](https://github.com/juyongjiang/ReflexiCoder)

> [!info] Summary
> ReflexiCoder uses reinforcement learning to enable large language models to perform autonomous code debugging and optimization through internalized reflection and correction mechanisms, achieving state-of-the-art performance with reduced computational overhead. While Large Language Models (LLMs) have revolutionized code generation, standard "System 1" approaches, generating solutions in a single forward pass, often hit a performance ceiling when faced with complex algorithmic tasks. Existing iterative refinement strategies attempt to bridge this gap at inference time, yet they predominantly rely on external oracles, execution feedback, or computationally expensive prompt-response cycles. In this work, we propose ReflexiCoder, a novel reinforcement learning (RL) framework that internalizes the structured reasoning trajectory, encompassing initial generation, bug and optimization aware reflection, and self-correction, directly into the model's weights.

> [!success] Key Contribution
> **We propose ReflexiCoder, a novel reinforcement learning (RL) framework that internalizes the structured reasoning trajectory, encompassing initial generation, bug and optimization aware reflection, and self-correction...**

### 21. [Reward Prediction with Factorized World States](https://arxiv.org/abs/2603.09400)

- Authors: Yijun Shen, Delong Chen, Xianming Hu, et al.
- Upvotes: **2**
- Keywords: reward prediction, state representation, factorized representation, hierarchical object-attribute structure, language models, semantic similarity, reward generalization, EPIC distance, agent planning, reactive policies, system-1 policies, system-2 agents
- Links: [arXiv](https://arxiv.org/abs/2603.09400) · [PDF](https://arxiv.org/pdf/2603.09400) · [HuggingFace](https://huggingface.co/papers/2603.09400) · [GitHub](https://github.com/yijunshens/StateFactory)

> [!info] Summary
> StateFactory enables reward prediction across domains by transforming observations into hierarchical object-attribute structures using language models, demonstrating superior zero-shot generalization compared to vision-language and large language model reward predictors. Agents must infer action outcomes and select actions that maximize a reward signal indicating how close the goal is to being reached. Supervised learning of reward models could introduce biases inherent to training data, limiting generalization to novel goals and environments. In this paper, we investigate whether well-defined world state representations alone can enable accurate reward prediction across domains.

> [!success] Key Contribution
> **We introduce StateFactory, a factorized representation method that transforms unstructured observations into a hierarchical object-attribute structure using language models.**

### 22. [Towards a Neural Debugger for Python](https://arxiv.org/abs/2603.09951)

- Authors: Maximilian Beck, Jonas Gehring, Jannik Kossen, et al.
- Upvotes: **2**
- Keywords: language models, neural interpreters, code execution, line-by-line execution prediction, debugger emulation, forward execution, inverse execution, conditional execution modeling, CruxEval, agentic coding systems, world model, simulated debugging environments
- Links: [arXiv](https://arxiv.org/abs/2603.09951) · [PDF](https://arxiv.org/pdf/2603.09951) · [HuggingFace](https://huggingface.co/papers/2603.09951)

> [!info] Summary
> Neural debuggers are language models that emulate traditional debuggers by supporting interactive control operations like stepping and breakpoint setting, enabling both forward and inverse execution prediction conditioned on debugger actions. Training large language models (LLMs) on Python execution traces grounds them in code execution and enables the line-by-line execution prediction of whole Python programs, effectively turning them into neural interpreters (FAIR CodeGen Team et al.,... However, developers rarely execute programs step by step; instead, they use debuggers to stop execution at certain breakpoints and step through relevant portions only while inspecting or modifying program variables. Existing neural interpreter approaches lack such interactive control.

> [!success] Key Contribution
> **We introduce neural debuggers: language models that emulate traditional debuggers, supporting operations such as stepping into, over, or out of functions, as well as setting breakpoints at specific source lines.**

### 23. [Beyond Test-Time Training: Learning to Reason via Hardware-Efficient Optimal Control](https://arxiv.org/abs/2603.09221)

- Authors: Peihao Wang, Shan Yang, Xijun Wang, et al.
- Upvotes: **0**
- Keywords: associative memory, sequential models, reinforcement learning, test-time training, optimal control, Test-Time Control (TTC) layer, finite-horizon LQR planning, latent states, value function, nested objective, hardware-efficient LQR solver, symplectic formulation, fused CUDA kernel, pretrained LLMs, mathematical reasoning, MATH-500, AMC, AIME
- Links: [arXiv](https://arxiv.org/abs/2603.09221) · [PDF](https://arxiv.org/pdf/2603.09221) · [HuggingFace](https://huggingface.co/papers/2603.09221) · [GitHub](https://github.com/VITA-Group/TTC-Net)

> [!info] Summary
> Test-Time Control layer integrates optimal control theory into language models for enhanced reasoning, using LQR planning and hardware-efficient solvers to improve mathematical problem-solving performance. Associative memory has long underpinned the design of sequential models. Beyond recall, humans reason by projecting future states and selecting goal-directed actions, a capability that modern language models increasingly require but do not natively encode. While prior work uses reinforcement learning or test-time training, planning remains external to the model architecture.

> [!success] Key Contribution
> **Test-Time Control layer integrates optimal control theory into language models for enhanced reasoning, using LQR planning and hardware-efficient solvers to improve mathematical problem-solving performance.**

## Audio, Speech & Music (6)

| Rank | Title | Upvotes |
|---|---|---:|
| 24 | [Omni-Diffusion: Unified Multimodal Understanding and Generation with Masked Discrete Diffusion](https://arxiv.org/abs/2603.06577) | 37 |
| 25 | [Fish Audio S2 Technical Report](https://arxiv.org/abs/2603.08823) | 13 |
| 26 | [Are Audio-Language Models Listening? Audio-Specialist Heads for Adaptive Audio Steering](https://arxiv.org/abs/2603.06854) | 9 |
| 27 | [Do What I Say: A Spoken Prompt Dataset for Instruction-Following](https://arxiv.org/abs/2603.09881) | 6 |
| 28 | [Bolbosh: Script-Aware Flow Matching for Kashmiri Text-to-Speech](https://arxiv.org/abs/2603.07513) | 1 |
| 29 | [A Text-Native Interface for Generative Video Authoring](https://arxiv.org/abs/2603.09072) | 0 |

### 24. [Omni-Diffusion: Unified Multimodal Understanding and Generation with Masked Discrete Diffusion](https://arxiv.org/abs/2603.06577)

- Authors: Lijiang Li, Zuwei Long, Yunhang Shen, et al.
- Upvotes: **37**
- Keywords: multimodal large language models, autoregressive architecture, discrete diffusion models, mask-based discrete diffusion models, multimodal systems, discrete multimodal tokens, bimodal tasks, multimodal foundation models
- Links: [arXiv](https://arxiv.org/abs/2603.06577) · [PDF](https://arxiv.org/pdf/2603.06577) · [HuggingFace](https://huggingface.co/papers/2603.06577) · [GitHub](https://github.com/VITA-MLLM/Omni-Diffusion)

> [!info] Summary
> Omni-Diffusion introduces the first any-to-any multimodal language model based on mask-based discrete diffusion models, unifying text, speech, and image processing in a single framework. While recent multimodal large language models (MLLMs) have made impressive strides, they predominantly employ a conventional autoregressive architecture as their backbone, leaving significant room to explore effective and efficient alternatives in architectural design. Concurrently, recent studies have successfully applied discrete diffusion models to various domains, such as visual understanding and image generation, revealing their considerable potential as a promising backbone for multimodal systems. Drawing inspiration from these pioneering research, we introduce Omni-Diffusion, the first any-to-any multimodal language model built entirely on mask-based discrete diffusion models, which unifies understanding and generation across text, speech, and images.

> [!success] Key Contribution
> **We introduce Omni-Diffusion, the first any-to-any multimodal language model built entirely on mask-based discrete diffusion models, which unifies understanding and generation across text, speech, and images.**

### 25. [Fish Audio S2 Technical Report](https://arxiv.org/abs/2603.08823)

- Authors: Shijia Liao, Yuxuan Wang, Songting Liu, et al.
- Upvotes: **13**
- Keywords: text-to-speech, multi-speaker, multi-turn generation, instruction-following control, natural-language descriptions, multi-stage training, staged data pipeline, video captioning, speech captioning, voice-quality assessment, reward modeling, SGLang-based inference engine, RTF, time-to-first-audio
- Links: [arXiv](https://arxiv.org/abs/2603.08823) · [PDF](https://arxiv.org/pdf/2603.08823) · [HuggingFace](https://huggingface.co/papers/2603.08823)

> [!info] Summary
> Fish Audio S2 is an open-source text-to-speech system with multi-speaker capabilities, multi-turn generation, and instruction-following control through natural-language descriptions, utilizing a multi-stage training approach and production-ready inference engine. We introduce Fish Audio S2, an open-sourced text-to-speech system featuring multi-speaker, multi-turn generation, and, most importantly, instruction-following control via natural-language descriptions. To scale training, we develop a multi-stage training recipe together with a staged data pipeline covering video captioning and speech captioning, voice-quality assessment, and reward modeling. To push the frontier of open-source TTS, we release our model weights, fine-tuning code, and an SGLang-based inference engine.

> [!success] Key Contribution
> **We introduce Fish Audio S2, an open-sourced text-to-speech system featuring multi-speaker, multi-turn generation, and, most importantly, instruction-following control via natural-language descriptions.**

### 26. [Are Audio-Language Models Listening? Audio-Specialist Heads for Adaptive Audio Steering](https://arxiv.org/abs/2603.06854)

- Authors: Neta Glazer, Lenny Aharon, Ethan Fetaya
- Upvotes: **9**
- Keywords: multimodal large language models, large audio-language models, mechanistic interpretability, attention heads, audio attention, listening signal, audio--silence steering direction, inference-time activation intervention, MMAU, Qwen-based LALMs
- Links: [arXiv](https://arxiv.org/abs/2603.06854) · [PDF](https://arxiv.org/pdf/2603.06854) · [HuggingFace](https://huggingface.co/papers/2603.06854)

> [!info] Summary
> Mechanistic interpretability identifies audio-specialist attention heads in large audio-language models to enhance audio utilization through activation interventions at inference time. Multimodal large language models can exhibit text dominance, over-relying on linguistic priors instead of grounding predictions in non-text inputs. One example is large audio-language models (LALMs) where decisive audio evidence can be under-utilized even when it contains important information. To address this issue we use mechanistic interpretability to identify a small set of audio-specialist attention heads whose audio attention yields a ``listening'' signal.

> [!success] Key Contribution
> **We show that this signal increases when audio evidence affects the model's output, providing an indicator of audio engagement under standard prompting.**

### 27. [Do What I Say: A Spoken Prompt Dataset for Instruction-Following](https://arxiv.org/abs/2603.09881)

- Authors: Maike Züfle, Sara Papi, Fabian Retkowski, et al.
- Upvotes: **6**
- Keywords: Speech Large Language Models, multilingual dataset, spoken prompts, written prompts, benchmarking, prompt modality, task type, language, cross-lingual settings, speech-output tasks
- Links: [arXiv](https://arxiv.org/abs/2603.09881) · [PDF](https://arxiv.org/pdf/2603.09881) · [HuggingFace](https://huggingface.co/papers/2603.09881) · [GitHub](https://github.com/MaikeZuefle/DOWIS)

> [!info] Summary
> Speech Large Language Models are evaluated using a new multilingual dataset that pairs spoken and written prompts across multiple tasks and languages, revealing that text prompts generally outperform spoken prompts except in speech-output tasks. Speech Large Language Models (SLLMs) have rapidly expanded, supporting a wide range of tasks. These models are typically evaluated using text prompts, which may not reflect real-world scenarios where users interact with speech. To address this gap, we introduce DoWhatISay (DOWIS), a multilingual dataset of human-recorded spoken and written prompts designed to pair with any existing benchmark for realistic evaluation of SLLMs under spoken instruction conditions.

> [!success] Key Contribution
> **We introduce DoWhatISay (DOWIS), a multilingual dataset of human-recorded spoken and written prompts designed to pair with any existing benchmark for realistic evaluation of SLLMs under spoken instruction conditions.**

### 28. [Bolbosh: Script-Aware Flow Matching for Kashmiri Text-to-Speech](https://arxiv.org/abs/2603.07513)

- Authors: Tajamul Ashraf, Burhaan Rasheed Zargar, Saeed Abdul Muizz, et al.
- Upvotes: **1**
- Keywords: Text-to-Speech, neural TTS, Optimal Transport Conditional Flow Matching, OT-CFM, Matcha-TTS, cross-lingual adaptation, flow-based adaptation, diacritics, phonotactics, Mel-Cepstral Distortion, Mean Opinion Score, acoustic enhancement, dereverberation, silence trimming, loudness normalization
- Links: [arXiv](https://arxiv.org/abs/2603.07513) · [PDF](https://arxiv.org/pdf/2603.07513) · [HuggingFace](https://huggingface.co/papers/2603.07513) · [GitHub](https://github.com/gaash-lab/Bolbosh)

> [!info] Summary
> A novel neural text-to-speech system for Kashmiri addresses challenges in diacritic modeling and limited data through supervised cross-lingual adaptation and acoustic enhancement techniques. Kashmiri is spoken by around 7 million people but remains critically underserved in speech technology, despite its official status and rich linguistic heritage. The lack of robust Text-to-Speech (TTS) systems limits digital accessibility and inclusive human-computer interaction for native speakers. In this work, we present the first dedicated open-source neural TTS system designed for Kashmiri.

> [!success] Key Contribution
> **We present the first dedicated open-source neural TTS system designed for Kashmiri.**

### 29. [A Text-Native Interface for Generative Video Authoring](https://arxiv.org/abs/2603.09072)

- Authors: Xingyu Bruce Liu, Mira Dontcheva, Dingzeyu Li
- Upvotes: **0**
- Keywords: N/A
- Links: [arXiv](https://arxiv.org/abs/2603.09072) · [PDF](https://arxiv.org/pdf/2603.09072) · [HuggingFace](https://huggingface.co/papers/2603.09072)

> [!info] Summary
> Everyone can write their stories in freeform text format -- it's something we all learn in school. Yet storytelling via video requires one to learn specialized and complicated tools. In this paper, we introduce Doki, a text-native interface for generative video authoring, aligning video creation with the natural process of text writing. In Doki, writing text is the primary interaction: within a single document, users define assets, structure scenes, create shots, refine edits, and add audio.

> [!success] Key Contribution
> **We introduce Doki, a text-native interface for generative video authoring, aligning video creation with the natural process of text writing.**

## Science & Mathematics (0)

| Rank | Title | Upvotes |
|---|---|---:|

## Systems & Infrastructure (1)

| Rank | Title | Upvotes |
|---|---|---:|
| 30 | [TALON: Test-time Adaptive Learning for On-the-Fly Category Discovery](https://arxiv.org/abs/2603.08075) | 0 |

### 30. [TALON: Test-time Adaptive Learning for On-the-Fly Category Discovery](https://arxiv.org/abs/2603.08075)

- Authors: Yanan Wu, Yuhan Yan, Tailai Chen, et al.
- Upvotes: **0**
- Keywords: on-the-fly category discovery, hash-based framework, feature quantization, category explosion, test-time adaptation, semantic-aware prototype update, stable test-time encoder update, margin-aware logit calibration, intra-class variance, inter-class margins
- Links: [arXiv](https://arxiv.org/abs/2603.08075) · [PDF](https://arxiv.org/pdf/2603.08075) · [HuggingFace](https://huggingface.co/papers/2603.08075) · [GitHub](https://github.com/ynanwu/TALON)

> [!info] Summary
> A test-time adaptation framework for on-the-fly category discovery that dynamically updates prototypes and encoder parameters while calibrating logits to improve novel class recognition and prevent category explosion. On-the-fly category discovery (OCD) aims to recognize known categories while simultaneously discovering novel ones from an unlabeled online stream, using a model trained only on labeled data. Existing approaches freeze the feature extractor trained offline and employ a hash-based framework that quantizes features into binary codes as class prototypes. However, discovering novel categories with a fixed knowledge base is counterintuitive, as the learning potential of incoming data is entirely neglected.

> [!success] Key Contribution
> **We propose a test-time adaptation framework that enables learning through discovery.**

## Other (0)

| Rank | Title | Upvotes |
|---|---|---:|

