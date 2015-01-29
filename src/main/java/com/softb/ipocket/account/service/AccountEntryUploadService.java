package com.softb.ipocket.account.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.NumberFormat;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import javax.inject.Inject;

import org.apache.commons.lang.time.DateUtils;
import org.apache.tomcat.util.http.fileupload.FileItemIterator;
import org.apache.tomcat.util.http.fileupload.FileItemStream;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import com.softb.ipocket.account.model.AccountEntry;
import com.softb.ipocket.account.model.AccountEntryImport;
import com.softb.ipocket.account.repository.AccountEntryRepository;
import com.softb.system.security.service.UserAccountService;

@Service
public class AccountEntryUploadService {
	
	@Autowired
	private AccountEntryRepository entryRepository;
	
	@Inject
	private UserAccountService userAccountService;

	/**
	 * Responsável por processar arquivos com lançamentos do tipo CSV separados por ;.
	 * @param accountId Número da conta onde os lançamentos serão feitos.
	 * @param fileIterator Arquivo.
	 * @return
	 * @throws ParseException 
	 * @throws IOException 
	 * @throws FileUploadException 
	 * @throws DataAccessException 
	 */
	public List<AccountEntryImport> csvImport(Integer accountId, FileItemIterator fileIterator) throws DataAccessException, FileUploadException, IOException, ParseException{
		List<AccountEntryImport> entriesToImport = new ArrayList<AccountEntryImport>();
		AccountEntryImport entryToImport = null;
		String[] dateFormat = {"dd/MM/yyyy"};
		NumberFormat nf = NumberFormat.getInstance(new Locale("pt","BR"));
		
		while (fileIterator.hasNext()) {
			FileItemStream stream = fileIterator.next();
			BufferedReader reader = new BufferedReader(new InputStreamReader(stream.openStream()));
			
			String line;
			while ((line = reader.readLine()) != null) {
				String[] lineData = line.replaceAll("\"", "").split(";");
				if (lineData.length > 0){
					entryToImport = new AccountEntryImport(DateUtils.parseDate(lineData[0], dateFormat), lineData[1].trim(), nf.parse(lineData[2]).doubleValue(), null, null, true);
					
					// Verifica se existe um lançamento na conta com mesma data e valor. Se existir aponta como provável conflito.
					List<AccountEntry> conflicts =  entryRepository.listAllByUserDateAmount(userAccountService.getCurrentUser().getId(), accountId, entryToImport.getDate(), entryToImport.getAmount());
					if (conflicts.size() > 0) {
						entryToImport.setOk(false);
						entryToImport.setConflicts(conflicts);
					}
					
					entriesToImport.add(entryToImport);
				}
				
			}
		}

		return entriesToImport;
	}
	
	/**
	 * Lê uma linha do stream
	 * @param stream
	 * @return
	 */
	protected String read(InputStream stream) {
		StringBuilder sb = new StringBuilder();
		BufferedReader reader = new BufferedReader(new InputStreamReader(stream));
		try {
			String line;
			while ((line = reader.readLine()) != null) {
				sb.append(line);
			}
		} catch (IOException e) {
			throw new RuntimeException(e);
		} finally {
			try {
				reader.close();
			} catch (IOException e) {
			}
		}
		return sb.toString();
	}
}
