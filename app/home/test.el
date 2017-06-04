(defun cesco/pcss ()
  (interactive)
  (if (file-exists-p (executable-find "tcm"))
      (if (projectile-project-p)
	  (if (file-exists-p (concat (projectile-project-root) "tslint.json" ))
	      (shell-command (concat "tcm" " " default-directory " -p **/*.pcss"))
	    )
	)
    (message "dont exist")
    )
  )
(defun cesco/pcss-save-hook ()
  "Sync org file to Raspberry Pi with external script."
  (when (eq major-mode 'org-mode)
    (when (and (stringp buffer-file-name)
	       (string-match "\\.pcss\\'" buffer-file-name))
      (cesco/pcss)
      (message "wrong place"))
    ))

(add-hook 'after-save-hook #'cesco/pcss-save-hook)