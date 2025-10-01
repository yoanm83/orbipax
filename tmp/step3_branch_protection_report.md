# Step 3 Branch Protection Configuration Report
**OrbiPax Intake Module - CI Gate Enforcement**

---

## 📋 Executive Summary

**Status**: 📝 **CONFIGURATION GUIDE READY**
**Date**: 2025-09-30
**Task**: Configure branch protection to require Step 3 CI Gate checks
**Scope**: `main` branch (and `release/*` if applicable)

**IMPORTANT**: This report provides the exact configuration steps. Branch protection must be applied by a repository administrator with the necessary permissions.

---

## 🎯 Objectives

1. ✅ Prevent merging PRs without passing all Step 3 CI Gate checks
2. ✅ Require code reviews before merge (minimum 1 approver)
3. ✅ Dismiss stale approvals when new commits are pushed
4. ✅ Enforce status checks: typecheck, eslint, sentinel, contracts-tests-step3, no-console, e2e-smoke-step3
5. ✅ Maintain consistency with Step 1/2 protection patterns

---

## 🔍 AUDIT: Current CI Gate Jobs

**Workflow**: `.github/workflows/intake-step3-gate.yml`

**Workflow Name**: `🛡️ Intake Step3 Gate - Clinical Assessment Module CI`

**Trigger**: Pull requests to `main`, `develop`, `release/*`

**Path Filters**:
- `src/modules/intake/**`
- `tests/modules/intake/**`
- `tests/e2e/intake/**`
- `package.json`, `package-lock.json`, `pnpm-lock.yaml`
- `.github/workflows/intake-step3-gate.yml`

---

### Job Inventory

| Job ID | Job Name | Status Check Context | Purpose |
|--------|----------|---------------------|---------|
| `contracts-tests-step3` | 📋 Contract Tests (Step3) | `contracts-tests-step3` | Application & Actions layer tests (25 tests) |
| `typecheck` | 🔍 TypeScript Check | `typecheck` | TypeScript type validation for Intake module |
| `eslint` | 📝 ESLint Check | `eslint` | Code quality & style enforcement |
| `sentinel` | 🏥 Sentinel Checks (SoC/PHI/A11y) | `sentinel` | Anti-legacy, SoC, PHI, Multi-tenant, A11y checks |
| `no-console` | 🚫 No Console Check | `no-console` | Production code hygiene (no console statements) |
| `e2e-smoke-step3` | 🔄 E2E Smoke Test (Step3) | `e2e-smoke-step3` | Full stack smoke test with RLS validation |

**Total Required Checks**: **6**

**Note**: `gate-summary` job is NOT included in required checks as it's a reporting job that runs `if: always()` and depends on all others.

---

## ⚙️ Configuration Instructions

### Method 1: GitHub Web UI (Recommended)

#### Step 1: Access Branch Protection Settings
1. Navigate to repository: `https://github.com/{owner}/orbipax-root`
2. Click **Settings** (top menu)
3. Click **Branches** (left sidebar under "Code and automation")
4. Under "Branch protection rules", click **Add rule** (or **Add classic branch protection rule**)

---

#### Step 2: Configure Main Branch Protection

**Branch name pattern**: `main`

---

##### Protection Settings to Enable

**Pull Request Requirements**:
- ✅ **Require a pull request before merging**
  - Number of required approvals: **1**
  - ✅ **Dismiss stale pull request approvals when new commits are pushed**
  - ✅ **Require review from Code Owners** (optional, if CODEOWNERS file exists)

**Status Check Requirements**:
- ✅ **Require status checks to pass before merging**
  - ✅ **Require branches to be up to date before merging** (optional but recommended)
  - Search and add the following status checks:
    1. `contracts-tests-step3` ← **Step 3 Gate**
    2. `typecheck` ← **Step 3 Gate**
    3. `eslint` ← **Step 3 Gate**
    4. `sentinel` ← **Step 3 Gate**
    5. `no-console` ← **Step 3 Gate**
    6. `e2e-smoke-step3` ← **Step 3 Gate**

**Additional Settings** (Optional but Recommended):
- ✅ **Require conversation resolution before merging**
- ✅ **Require linear history** (if using squash or rebase merge strategy)
- ✅ **Do not allow bypassing the above settings** (prevents admins from bypassing)
- ⬜ **Allow force pushes** (leave UNCHECKED)
- ⬜ **Allow deletions** (leave UNCHECKED)

**Rules Applied to Administrators**:
- ✅ **Include administrators** (recommended - admins also must pass checks)

---

#### Step 3: Configure Release Branch Protection (If Applicable)

If your repository uses `release/*` branches (e.g., `release/v1.0`, `release/v1.1`):

**Branch name pattern**: `release/*`

**Apply the same settings as `main` branch** (see Step 2 above)

**Note**: This ensures hotfixes and release preparation follow the same quality gates.

---

#### Step 4: Save Configuration

1. Click **Create** (or **Save changes**)
2. Verify the rule appears in the "Branch protection rules" list
3. Rule status should show: **Active**

---

### Method 2: GitHub CLI (Alternative)

**Prerequisites**:
- Install GitHub CLI: `gh auth login`
- Repository admin permissions

---

#### Configure Main Branch

```bash
gh api repos/{owner}/{repo}/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["contracts-tests-step3","typecheck","eslint","sentinel","no-console","e2e-smoke-step3"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"dismissal_restrictions":{},"dismiss_stale_reviews":true,"require_code_owner_reviews":false,"required_approving_review_count":1}' \
  --field restrictions=null \
  --field required_linear_history=false \
  --field allow_force_pushes=false \
  --field allow_deletions=false \
  --field required_conversation_resolution=true
```

**Replace**:
- `{owner}` → Your GitHub organization/username
- `{repo}` → Repository name (e.g., `orbipax-root`)

---

#### Configure Release Branch (If Applicable)

```bash
gh api repos/{owner}/{repo}/branches/release/*/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["contracts-tests-step3","typecheck","eslint","sentinel","no-console","e2e-smoke-step3"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"dismissal_restrictions":{},"dismiss_stale_reviews":true,"require_code_owner_reviews":false,"required_approving_review_count":1}' \
  --field restrictions=null \
  --field required_linear_history=false \
  --field allow_force_pushes=false \
  --field allow_deletions=false \
  --field required_conversation_resolution=true
```

**Note**: Wildcard branch patterns (`release/*`) may require setting up branch patterns via the web UI, as the API requires exact branch names.

---

#### Verify Configuration (CLI)

```bash
# Check main branch protection
gh api repos/{owner}/{repo}/branches/main/protection | jq .

# List required status checks
gh api repos/{owner}/{repo}/branches/main/protection/required_status_checks | jq .contexts
```

**Expected Output**:
```json
[
  "contracts-tests-step3",
  "typecheck",
  "eslint",
  "sentinel",
  "no-console",
  "e2e-smoke-step3"
]
```

---

## ✅ Verification Checklist

### Pre-Merge Verification (Before Applying Protection)

- [ ] Verify CI Gate workflow exists: `.github/workflows/intake-step3-gate.yml`
- [ ] Confirm 6 job names match the status check contexts listed above
- [ ] Ensure workflow triggers on PRs to `main` (and `release/*` if applicable)
- [ ] Test workflow runs successfully on a test branch (optional)

### Post-Configuration Verification

#### Visual Verification (GitHub UI)
1. [ ] Navigate to **Settings → Branches**
2. [ ] Confirm rule exists for `main` with status: **Active**
3. [ ] Confirm rule exists for `release/*` if applicable
4. [ ] Click **Edit** on the rule
5. [ ] Verify **6 status checks** are listed under "Require status checks to pass"
6. [ ] Verify **Require pull request reviews** is enabled (1 approval)
7. [ ] Verify **Dismiss stale reviews** is checked

---

#### Functional Verification (Create Test PR)

**Step 1: Create Test Branch**
```bash
cd D:\ORBIPAX-PROJECT
git checkout -b test/branch-protection-verify
```

**Step 2: Make Trivial Change to Trigger Workflow**
```bash
# Touch a file in the Intake module
echo "// Test branch protection" >> src/modules/intake/README.md
git add src/modules/intake/README.md
git commit -m "test: verify branch protection rules"
git push origin test/branch-protection-verify
```

**Step 3: Create Pull Request**
```bash
gh pr create --base main --head test/branch-protection-verify \
  --title "test: Verify Step 3 CI Gate branch protection" \
  --body "This PR tests branch protection rules for Step 3 CI Gate. Expected behavior: Merge button should be blocked until all 6 checks pass."
```

**Step 4: Verify PR Behavior**

Navigate to the PR page and confirm:
- [ ] **6 status checks appear** in the "Checks" section:
  - ⏳ contracts-tests-step3 (queued/running/passed)
  - ⏳ typecheck (queued/running/passed)
  - ⏳ eslint (queued/running/passed)
  - ⏳ sentinel (queued/running/passed)
  - ⏳ no-console (queued/running/passed)
  - ⏳ e2e-smoke-step3 (queued/running/passed)
- [ ] **Merge button is disabled** with message: "Merging is blocked: Required status checks must pass"
- [ ] **Review requirement** shows: "At least 1 approving review is required"
- [ ] After all checks pass, **merge button becomes available** (after approval)

---

#### Negative Test: Force Failure (Optional)

**Purpose**: Verify branch protection blocks merge when a check fails

**Step 1: Create Branch with Intentional Failure**
```bash
git checkout -b test/force-eslint-failure

# Introduce ESLint error
echo "const unused = 'variable'" >> src/modules/intake/application/step3/usecases.ts
git add src/modules/intake/application/step3/usecases.ts
git commit -m "test: intentional eslint error"
git push origin test/force-eslint-failure
```

**Step 2: Create PR and Verify Blocking**
```bash
gh pr create --base main --head test/force-eslint-failure \
  --title "test: Verify ESLint check blocks merge" \
  --body "This PR intentionally fails ESLint to test branch protection."
```

**Expected Behavior**:
- [ ] **ESLint check fails** with ❌ status
- [ ] **Merge button is blocked** with message: "Required status checks failing: eslint"
- [ ] **PR cannot be merged** even with approval until ESLint is fixed

**Step 3: Cleanup**
```bash
# Close the test PR without merging
gh pr close test/force-eslint-failure

# Delete test branches
git checkout main
git branch -D test/branch-protection-verify test/force-eslint-failure
git push origin --delete test/branch-protection-verify test/force-eslint-failure
```

---

## 📊 Expected Outcomes

### PR Status Before All Checks Pass

```
┌─────────────────────────────────────────────────────┐
│  Pull Request #123                                  │
│  test: Add Step 3 clinical assessment feature       │
└─────────────────────────────────────────────────────┘

Reviews:
  ⏳ Awaiting review from at least 1 reviewer

Checks:
  ⏳ contracts-tests-step3 — Running...
  ⏳ typecheck — In progress...
  ⏳ eslint — Queued...
  ⏳ sentinel — Queued...
  ⏳ no-console — Queued...
  ⏳ e2e-smoke-step3 — Queued...

Status:
  🚫 Merging is blocked
     - Required status checks must pass
     - At least 1 approving review is required

[Merge pull request ▼] (DISABLED)
```

---

### PR Status After All Checks Pass + Approval

```
┌─────────────────────────────────────────────────────┐
│  Pull Request #123                                  │
│  test: Add Step 3 clinical assessment feature       │
└─────────────────────────────────────────────────────┘

Reviews:
  ✅ Approved by @reviewer (2 hours ago)

Checks:
  ✅ contracts-tests-step3 — 25/25 tests passed
  ✅ typecheck — No TypeScript errors
  ✅ eslint — No linting errors
  ✅ sentinel — All compliance checks passed
  ✅ no-console — No console statements found
  ✅ e2e-smoke-step3 — 3/3 E2E tests passed

Status:
  ✅ All checks have passed

[Merge pull request ▼] (ENABLED)
  ↳ Create a merge commit
  ↳ Squash and merge
  ↳ Rebase and merge
```

---

### PR Status When Check Fails

```
┌─────────────────────────────────────────────────────┐
│  Pull Request #124                                  │
│  fix: Update diagnoses schema validation            │
└─────────────────────────────────────────────────────┘

Reviews:
  ✅ Approved by @reviewer (1 hour ago)

Checks:
  ✅ contracts-tests-step3 — 25/25 tests passed
  ❌ typecheck — TypeScript errors found
  ✅ eslint — No linting errors
  ✅ sentinel — All compliance checks passed
  ✅ no-console — No console statements found
  ✅ e2e-smoke-step3 — 3/3 E2E tests passed

Status:
  🚫 Merging is blocked
     - Required status checks failing: typecheck

[Merge pull request ▼] (DISABLED)

Details:
  typecheck failed at 11:23 AM
  src/modules/intake/application/step3/dtos.ts:45:12
  Type 'string | undefined' is not assignable to type 'string'
```

---

## 🔄 Consistency with Step 1/2 Pattern

### Comparison Matrix

| Setting | Step 1/2 | Step 3 | Status |
|---------|----------|--------|--------|
| Branch pattern | `main` | `main` | ✅ Match |
| Release branches | `release/*` | `release/*` | ✅ Match |
| Required approvals | 1 | 1 | ✅ Match |
| Dismiss stale reviews | ✅ | ✅ | ✅ Match |
| Contract tests check | ✅ | ✅ `contracts-tests-step3` | ✅ Match |
| TypeCheck | ✅ | ✅ | ✅ Match |
| ESLint | ✅ | ✅ | ✅ Match |
| Sentinel | ✅ | ✅ | ✅ Match |
| No-Console | ✅ | ✅ | ✅ Match |
| E2E Smoke | ✅ | ✅ `e2e-smoke-step3` | ✅ Match |
| Total required checks | 6 | 6 | ✅ Match |

**Verdict**: ✅ **Step 3 protection aligns perfectly with Step 1/2 pattern**

---

## 📝 Configuration Summary

### Main Branch Protection Rule

**Pattern**: `main`

**Required Status Checks** (6):
1. ✅ `contracts-tests-step3`
2. ✅ `typecheck`
3. ✅ `eslint`
4. ✅ `sentinel`
5. ✅ `no-console`
6. ✅ `e2e-smoke-step3`

**Pull Request Settings**:
- ✅ Require 1 approving review
- ✅ Dismiss stale reviews on new commits
- ✅ Require conversation resolution

**Restrictions**:
- ❌ Force pushes: **Not allowed**
- ❌ Branch deletion: **Not allowed**
- ✅ Include administrators: **Enforced**

---

### Release Branch Protection Rule (If Applicable)

**Pattern**: `release/*`

**Settings**: Same as `main` branch (see above)

**Purpose**: Ensures hotfixes and release branches follow the same quality standards

---

## 🛡️ Security & Compliance Notes

### PHI Protection
- ✅ Branch protection does NOT expose PHI in logs or PR checks
- ✅ Sentinel job validates PHI protection in code
- ✅ Error messages in checks are generic (no field details)

### Multi-Tenant Safety
- ✅ Checks validate organizationId requirements
- ✅ Sentinel job validates multi-tenant reset functionality
- ✅ E2E tests verify RLS enforcement implicitly

### Accessibility
- ✅ Sentinel job validates ARIA attributes
- ✅ Checks for toast vs inline errors
- ✅ A11y compliance required for merge

### Anti-Legacy Protection
- ✅ Sentinel job blocks reintroduction of deprecated patterns
- ✅ Enforces RHF migration compliance
- ✅ Prevents legacy store usage

---

## 🚨 Troubleshooting

### Issue: Status checks not appearing in PR

**Cause**: Workflow hasn't run yet, or path filters don't match changed files

**Solution**:
1. Verify workflow triggers on PRs to target branch
2. Check path filters include modified files
3. Manually trigger workflow from Actions tab (if applicable)

---

### Issue: Can't find status check contexts in branch protection UI

**Cause**: Status checks must run at least once before they appear in the dropdown

**Solution**:
1. Create a test PR that triggers the workflow
2. Wait for all checks to complete
3. Return to branch protection settings
4. Search for check names in the status check dropdown

---

### Issue: Merge button still enabled despite failing checks

**Cause**: Branch protection not properly configured or user has bypass permissions

**Solution**:
1. Verify "Require status checks" is enabled
2. Check all 6 checks are selected
3. Ensure "Include administrators" is checked
4. Verify rule is **Active** (not draft)

---

### Issue: Checks pass but merge still blocked

**Cause**: Missing required approval or unresolved conversations

**Solution**:
1. Check "Reviews" section for approval count
2. Check "Conversations" tab for unresolved threads
3. Address all blockers before attempting merge

---

## 📋 Final Checklist

### Configuration Completed
- [ ] Main branch protection rule created
- [ ] Release/* branch protection rule created (if applicable)
- [ ] All 6 status checks added as required
- [ ] Pull request reviews required (1 minimum)
- [ ] Dismiss stale reviews enabled
- [ ] Conversation resolution required
- [ ] Force pushes disabled
- [ ] Branch deletion disabled
- [ ] Administrator enforcement enabled

### Verification Completed
- [ ] Test PR created and verified
- [ ] All 6 checks appeared in PR
- [ ] Merge button blocked until checks pass
- [ ] Approval requirement enforced
- [ ] Merge button enabled after all conditions met
- [ ] Negative test performed (optional)
- [ ] Test branches cleaned up

### Documentation
- [ ] Configuration steps documented
- [ ] CLI commands provided (alternative method)
- [ ] Verification checklist completed
- [ ] Screenshots or evidence captured (optional)
- [ ] Report saved in `tmp/step3_branch_protection_report.md`

---

## 📚 References

### Workflow File
- `.github/workflows/intake-step3-gate.yml` (6 jobs: contracts-tests-step3, typecheck, eslint, sentinel, no-console, e2e-smoke-step3)

### Related Reports
- `tmp/step3_ci_gate_apply_report.md` - CI Gate implementation
- `tmp/step3_contract_tests_report.md` - Contract tests (25 tests)
- `tmp/step3_e2e_ci_smoke_report.md` - E2E smoke tests (3 tests)

### GitHub Documentation
- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Required Status Checks](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-status-checks-before-merging)
- [GitHub CLI API](https://cli.github.com/manual/gh_api)

---

## 🎓 Best Practices

### 1. Test Protection Rules Before Enabling
Create a test PR to verify all checks work as expected before enforcing on `main`.

### 2. Gradual Rollout
Consider enabling protection on `develop` branch first, then `main` after team is comfortable.

### 3. Clear Communication
Notify team before enabling protection rules and provide this documentation.

### 4. Monitor Impact
Track PR merge time and check failure rates to identify bottlenecks.

### 5. Regular Audits
Periodically review protection rules to ensure they align with current CI Gate jobs.

---

**Report Generated**: 2025-09-30
**Status**: ✅ **CONFIGURATION GUIDE READY**
**Action Required**: Repository administrator must apply branch protection settings via GitHub UI or CLI

---

## ⚠️ IMPORTANT NOTES

1. **Admin Permissions Required**: Branch protection configuration requires repository admin access
2. **No Code Changes**: This configuration is done via GitHub Settings or API - no files modified
3. **Reversible**: Branch protection rules can be edited or deleted if needed
4. **Team Impact**: All contributors must follow the new merge requirements
5. **CI Dependency**: PRs cannot merge if CI Gate workflow fails

**Next Steps**: Share this report with repository administrators to apply the configuration.